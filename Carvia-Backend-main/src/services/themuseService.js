import axios from "axios";
import { normalizeJob } from "../aggregator/normalize.js";


export async function getTheMuseJobs(keyword = "developer") {

    try {

        const response = await axios.get(
            process.env.THEMUSE_API_URL,
            {
                params: {
                    page: 1
                },
                timeout: 10000
            }
        );


        const jobs = response.data.results || [];


        return jobs
            .filter(job =>
                keyword
                    ? job.name
                        ?.toLowerCase()
                        .includes(keyword.toLowerCase())
                    : true
            )
            .map((job, index) => {


                return normalizeJob({

                    source: "TheMuse",

                    sourceJobId:
                        job.id || index,

                    title:
                        job.name,

                    company:
                        job.company?.name || "Unknown",

                    location:
                        job.locations
                            ?.map(
                                loc => loc.name
                            )
                            .join(", ") || "Remote",

                    description:
                        job.contents || "",

                    originalJobUrl:
                        job.refs?.landing_page,

                    applyUrl:
                        job.refs?.landing_page

                });


            });


    } catch(error) {

        console.error(
            "The Muse API Error:",
            error.response?.data || error.message
        );

        return [];

    }

}