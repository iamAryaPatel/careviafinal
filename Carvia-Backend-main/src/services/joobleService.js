import axios from "axios";
import { normalizeJob } from "../aggregator/normalize.js";


export async function getJoobleJobs(keyword = "developer") {

    try {

        const url = `${process.env.JOOBLE_API_URL}/${process.env.JOOBLE_API_KEY}`;


        const response = await axios.post(
            url,
            {
                keywords: keyword,
                location: "India",
                page: 1
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        );


        const jobs = response.data.jobs || [];


        return jobs.map((job, index) =>

            normalizeJob({

                source: "Jooble",

                sourceJobId:
                    job.id || index,

                title:
                    job.title,

                company:
                    job.company,

                location:
                    job.location,

                description:
                    job.snippet || "",

                originalJobUrl:
                    job.link,

                applyUrl:
                    job.link

            })

        );


    } catch(error) {

        console.error(
            "Jooble API Error:",
            error.response?.data || error.message
        );

        return [];

    }

}