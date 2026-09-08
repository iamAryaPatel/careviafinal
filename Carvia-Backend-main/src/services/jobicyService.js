import axios from "axios";
import { normalizeJob } from "../aggregator/normalize.js";


export async function getJobicyJobs(keyword = "") {

    try {

        const response = await axios.get(
            process.env.JOBICY_API_URL,
            {
                timeout:10000
            }
        );


        const jobs = response.data.jobs || [];


        return jobs
            .filter(job =>
                keyword
                    ? job.jobTitle
                        .toLowerCase()
                        .includes(keyword.toLowerCase())
                    : true
            )
            .map((job,index)=>{


                return normalizeJob({

                    source:"Jobicy",

                    sourceJobId:
                        job.id || index,

                    title:
                        job.jobTitle,

                    company:
                        job.companyName,

                    location:
                        job.jobGeo,

                    description:
                        job.jobDescription,

                    originalJobUrl:
                        job.url,

                    applyUrl:
                        job.url,

                    companyLogo:
                        job.companyLogo,

                    workplaceType:
                        "remote"

                });


            });


    } catch(error) {

        console.error(
            "Jobicy API Error:",
            error.message
        );

        return [];

    }

}