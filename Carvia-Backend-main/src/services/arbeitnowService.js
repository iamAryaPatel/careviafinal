import axios from "axios";
import { normalizeJob } from "../aggregator/normalize.js";


/**
 * Fetch jobs from the Arbeitnow Job Board API.
 * API docs: https://www.arbeitnow.com/blog/job-board-api
 *
 * The API is free, requires no key, and returns paginated results.
 * Each job has: slug, company_name, title, description, remote,
 * url, tags, job_types, location, created_at.
 */
export async function getArbeitnowJobs(keyword = "") {

    try {

        const baseUrl =
            process.env.ARBEITNOW_API_URL ||
            "https://www.arbeitnow.com/api/job-board-api";

        // Fetch up to 5 pages to get more job listings
        const maxPages = 5;
        let allJobs = [];
        let page = 1;

        while (page <= maxPages) {

            const url = page === 1
                ? baseUrl
                : `${baseUrl}?page=${page}`;

            const response = await axios.get(url, {
                timeout: 10000
            });

            const pageJobs = response.data.data || [];

            if (pageJobs.length === 0) break;

            allJobs.push(...pageJobs);

            // Stop if no more pages
            const meta = response.data.meta;
            if (
                !meta ||
                !meta.last_page ||
                page >= meta.last_page
            ) {
                break;
            }

            page++;
        }


        return allJobs
            .filter(job =>
                keyword
                    ? (
                        job.title
                            .toLowerCase()
                            .includes(keyword.toLowerCase()) ||
                        job.company_name
                            .toLowerCase()
                            .includes(keyword.toLowerCase()) ||
                        (job.tags || [])
                            .join(" ")
                            .toLowerCase()
                            .includes(keyword.toLowerCase())
                    )
                    : true
            )
            .map((job, index) => {

                // Map job_types array to employmentType string
                const employmentType =
                    Array.isArray(job.job_types) && job.job_types.length > 0
                        ? job.job_types[0]
                        : null;

                // Map tags to category (first tag) and skills
                const category =
                    Array.isArray(job.tags) && job.tags.length > 0
                        ? job.tags[0]
                        : "General";

                return normalizeJob({

                    source: "Arbeitnow",

                    sourceJobId:
                        job.slug || index,

                    title:
                        job.title,

                    company:
                        job.company_name,

                    location:
                        job.location || "Europe",

                    description:
                        job.description,

                    originalJobUrl:
                        job.url,

                    applyUrl:
                        job.url,

                    workplaceType:
                        job.remote
                            ? "remote"
                            : undefined,

                    employmentType,

                    category,

                    skills:
                        Array.isArray(job.tags)
                            ? job.tags
                            : [],

                    postedAt:
                        job.created_at
                            ? new Date(job.created_at * 1000)
                            : null

                });

            });


    } catch(error) {

        console.error(
            "Arbeitnow API Error:",
            error.message
        );

        return [];

    }

}