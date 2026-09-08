import axios from "axios";
import { normalizeJob } from "../aggregator/normalize.js";


export async function getRemotiveJobs(keyword = "") {

    try {

        const response = await axios.get(
            process.env.REMOTIVE_API_URL,
            {
                params: {
                    search: keyword || undefined,
                    limit: 100
                },
                timeout: 10000
            }
        );


        const jobs = response.data.jobs || [];


        return jobs.map((job, index) => {

            return normalizeJob({

                source: "Remotive",

                sourceJobId:
                    job.id || index,

                title:
                    job.title,

                company:
                    job.company_name,

                location:
                    job.candidate_required_location,

                description:
                    job.description,

                category:
                    job.category,

                employmentType:
                    job.job_type,

                companyLogo:
                    job.company_logo,

                originalJobUrl:
                    job.url,

                applyUrl:
                    job.url,

                postedAt:
                    job.publication_date,

                workplaceType:
                    "remote"

            });

        });


    } catch(error) {

        console.error(
            "Remotive API Error:",
            error.message
        );

        return [];

    }

}