import { supabase } from '../config/supabase';

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': session ? `Bearer ${session.access_token}` : '',
  };
}

export function normalizeJob(job) {
  if (!job) return null;
  
  let salaryStr = 'Salary Disclosed';
  if (job.salaryMin && job.salaryMax) {
    salaryStr = `${job.currency || '₹'}${job.salaryMin.toLocaleString()} - ${job.currency || '₹'}${job.salaryMax.toLocaleString()}`;
  } else if (job.salary) {
    salaryStr = job.salary;
  }

  const modeStr = job.workplaceType 
    ? (job.workplaceType.charAt(0).toUpperCase() + job.workplaceType.slice(1))
    : (job.isRemote ? 'Remote' : (job.mode || 'On-site'));

  const locationStr = job.location || (job.isRemote ? 'Remote' : 'India');

  const logoStr = job.companyLogo || job.logo || (job.company ? job.company.slice(0, 2).toUpperCase() : 'JO');

  const skillsArr = Array.isArray(job.skills) && job.skills.length > 0
    ? job.skills
    : ['General'];

  return {
    id: job.id || `job-${Math.random().toString(36).substr(2, 9)}`,
    title: job.title || 'Untitled Role',
    company: job.company || 'Company Confidential',
    logo: logoStr,
    location: locationStr,
    mode: modeStr,
    type: job.employmentType || job.type || 'Full-time',
    experience: job.experienceLevel || job.experience || '1–3 years',
    salary: salaryStr,
    source: job.source || 'Aggregated',
    sourceDomain: job.sourceDomain || 'jobboard.com',
    direct: typeof job.isDirectCompanyListing === 'boolean' ? job.isDirectCompanyListing : (job.direct || false),
    verified: job.lastVerifiedAt ? 'Recently verified' : (job.verified || 'Verified'),
    posted: job.postedAt ? new Date(job.postedAt).toLocaleDateString() : (job.posted || 'Recently'),
    postedAt: job.postedAt || null,
    score: job.score || Math.floor(Math.random() * 20) + 78,
    skills: skillsArr,
    description: job.description || 'No detailed description available.',
    url: job.applyUrl || job.originalJobUrl || job.url || '#'
  };
}

export async function fetchJobs(keyword = '') {
  const headers = await getAuthHeaders();
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const url = keyword
    ? `${apiBase}/v1/jobs?keyword=${encodeURIComponent(keyword)}`
    : `${apiBase}/v1/jobs`;
    
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error('Failed to fetch jobs');
  const data = await response.json();
  const rawResults = data.results || (Array.isArray(data) ? data : []);
  console.log("FRONTEND JOB COUNT:", rawResults.length, "API TOTAL:", data.total);
  return {
    total: data.total || rawResults.length,
    results: rawResults.map(normalizeJob)
  };
}

export async function searchJobs(keyword = 'developer') {
  const headers = await getAuthHeaders();
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const url = `${apiBase}/v1/jobs?keyword=${encodeURIComponent(keyword)}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error('Search failed');
  const data = await response.json();
  const rawResults = data.results || (Array.isArray(data) ? data : []);
  return {
    keyword,
    total: data.total || rawResults.length,
    results: rawResults.map(normalizeJob)
  };
}

export async function searchLinkedInJobs(keyword = 'developer') {
  return searchJobs(keyword);
}

