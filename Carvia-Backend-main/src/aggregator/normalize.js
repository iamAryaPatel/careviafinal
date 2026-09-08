import crypto from "crypto";

const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();

const slug = (value) =>
  clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const SKILLS = [
  "javascript",
  "typescript",
  "react",
  "next.js",
  "angular",
  "vue",
  "node",
  "node.js",
  "express",
  "java",
  "spring",
  "python",
  "django",
  "flask",
  "c",
  "c++",
  "c#",
  ".net",
  "php",
  "laravel",
  "go",
  "rust",
  "kotlin",
  "swift",
  "html",
  "css",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "redis",
  "firebase",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "git",
  "linux",
  "figma",
  "tensorflow",
  "pytorch",
  "machine learning",
  "artificial intelligence",
  "ai"
];

const skillsFrom = (text) => {
  const lower = clean(text).toLowerCase();
  return SKILLS.filter((skill) => lower.includes(skill));
};

function detectWorkplace(location) {
  const value = clean(location).toLowerCase();

  if (
    value.includes("remote") ||
    value.includes("work from home") ||
    value.includes("wfh")
  ) {
    return "remote";
  }

  if (value.includes("hybrid")) {
    return "hybrid";
  }

  return "onsite";
}

export function normalizeJob(raw) {
  const title = clean(raw.title);
  const company = clean(raw.company);
  const description = clean(raw.description);

  const originalJobUrl = raw.originalJobUrl || raw.applyUrl;

  if (!title || !company || !originalJobUrl) {
    throw new Error("Job is missing title, company or URL.");
  }

  const canonical = new URL(originalJobUrl);
  canonical.hash = "";
  canonical.search = "";

  const sourceJobId = raw.sourceJobId
    ? String(raw.sourceJobId)
    : undefined;

  const id =
    raw.id ||
    crypto
      .createHash("sha256")
      .update(`${raw.source}:${sourceJobId || canonical.href}`)
      .digest("hex")
      .slice(0, 24);

  const location = clean(raw.location || "Not Specified");

  const skills =
    raw.skills && raw.skills.length
      ? raw.skills
      : skillsFrom(`${title} ${description}`);

  return {
    id,

    source: raw.source || "Unknown",

    sourceDomain:
      raw.sourceDomain || canonical.hostname,

    sourceJobId,

    title,

    company,

    companyLogo: raw.companyLogo || null,

    category:
      raw.category || "Software Development",

    location,

    workplaceType:
      raw.workplaceType ||
      detectWorkplace(location),

    isRemote:
      detectWorkplace(location) === "remote",

    employmentType:
      raw.employmentType || null,

    experienceLevel:
      raw.experienceLevel || null,

    salaryMin:
      raw.salaryMin ??
      raw.salary?.min ??
      null,

    salaryMax:
      raw.salaryMax ??
      raw.salary?.max ??
      null,

    currency:
      raw.currency || null,

    description,

    skills,

    postedAt:
      raw.postedAt
        ? new Date(raw.postedAt)
        : null,

    scrapedAt: new Date(),

    lastVerifiedAt: new Date(),

    originalJobUrl: canonical.href,

    applyUrl:
      raw.applyUrl || canonical.href,

    isDirectCompanyListing:
      Boolean(raw.isDirectCompanyListing),

    isActive: true,

    searchText: `
      ${title}
      ${company}
      ${location}
      ${description}
      ${skills.join(" ")}
    `
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim(),

    dedupeKey: `${slug(title)}|${slug(company)}|${slug(location)}`
  };
}

function tokenSet(text) {
  return new Set(
    clean(text)
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 3)
  );
}

function similarity(a, b) {
  const left = tokenSet(a);
  const right = tokenSet(b);

  const overlap = [...left].filter((x) =>
    right.has(x)
  ).length;

  return overlap / Math.max(1, new Set([...left, ...right]).size);
}

export function deduplicateJobs(jobs) {
  const selected = [];

  for (const job of jobs) {
    const existing = selected.find(
      (item) =>
        item.originalJobUrl === job.originalJobUrl ||
        (
          item.source === job.source &&
          item.sourceJobId === job.sourceJobId
        ) ||
        (
          item.dedupeKey === job.dedupeKey &&
          similarity(item.description, job.description) > 0.58
        )
    );

    if (!existing) {
      selected.push(job);
      continue;
    }

    if (
      job.isDirectCompanyListing &&
      !existing.isDirectCompanyListing
    ) {
      selected.splice(
        selected.indexOf(existing),
        1,
        job
      );
    }
  }

  return selected.map(({ dedupeKey, ...job }) => job);
}