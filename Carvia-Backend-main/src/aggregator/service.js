import { saveJobsToDatabase } from "../services/jobDatabaseService.js";
import crypto from "crypto";

import { getJoobleJobs } from "../services/joobleService.js";
import { getJobicyJobs } from "../services/jobicyService.js";
import { getArbeitnowJobs } from "../services/arbeitnowService.js";
import { getRemotiveJobs } from "../services/remotiveService.js";
import { getTheMuseJobs } from "../services/themuseService.js";

import { deduplicateJobs } from "./normalize.js";


let cachedJobs = [];
let lastSync = null;


export function getAggregatedJobs() {
    return cachedJobs;
}


export async function syncAllSources(keyword = "") {

    try {

        const results = await Promise.allSettled([

            getJoobleJobs(keyword),

            getJobicyJobs(keyword),

            getArbeitnowJobs(keyword),

            getRemotiveJobs(keyword),

            getTheMuseJobs(keyword)

        ]);


        let jobs = [];


        results.forEach(result => {

            if(result.status === "fulfilled") {

                jobs.push(...result.value);

            } else {

                console.error(
                    "Source failed:",
                    result.reason
                );

            }

        });


        let allFetchedJobs = [...cachedJobs, ...jobs];
        cachedJobs = deduplicateJobs(allFetchedJobs);
        await saveJobsToDatabase(cachedJobs);
        console.log(
        "Jobs by source:",
        cachedJobs.reduce((acc, job) => {
        acc[job.source] = (acc[job.source] || 0) + 1;
        return acc;
    }, {})
);

        lastSync = new Date();


        return cachedJobs;


    } catch(error) {

        console.error(error);

        return [];

    }

}



export async function syncSource(source, keyword="") {

    switch(source.toLowerCase()) {

        case "jooble":
            return await getJoobleJobs(keyword);

        case "jobicy":
            return await getJobicyJobs(keyword);

        case "arbeitnow":
            return await getArbeitnowJobs(keyword);

        case "remotive":
            return await getRemotiveJobs(keyword);

        case "themuse":
            return await getTheMuseJobs(keyword);

        default:
            throw new Error("Unknown source");

    }

}



export function getCrawlerStatus(){

    return {
        totalJobs: cachedJobs.length,
        lastSync
    };

}

export async function searchAllSources(keyword = "") {
    if (!keyword.trim()) {
        return [];
    }

    try {
        const results = await Promise.allSettled([
            getJoobleJobs(keyword),
            getJobicyJobs(keyword),
            getArbeitnowJobs(keyword),
            getRemotiveJobs(keyword),
            getTheMuseJobs(keyword)
        ]);

        let jobs = [];

        results.forEach(result => {
            if (result.status === "fulfilled") {
                jobs.push(...result.value);
            } else {
                console.error(
                    "Search source failed:",
                    result.reason
                );
            }
        });

        return deduplicateJobs(jobs);

    } catch (error) {
        console.error("Job search failed:", error);
        return [];
    }
}

export function startScheduler(){

    const minutes =
        Number(process.env.CRAWLER_SCHEDULE_MINUTES) || 1440;


    console.log(
        `⏰ Scheduler running every ${minutes} minutes`
    );


    // Run once when server starts
    syncAllSources()
    .then(() => {
        console.log("✅ Initial job sync completed");
    })
    .catch(error => {
        console.error(
            "❌ Initial sync failed:",
            error.message
        );
    });


    // Run automatically
    setInterval(() => {

        console.log("🔄 Starting scheduled job update...");


        syncAllSources()
        .then(() => {
            console.log("✅ Scheduled update completed");
        })
        .catch(error => {
            console.error(
                "❌ Scheduled update failed:",
                error.message
            );
        });


    }, minutes * 60 * 1000);

}



export function updateSource(id, body){

    return {
        id,
        body,
        message:"Updated"
    };

}