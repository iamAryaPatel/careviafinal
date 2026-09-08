import { supabase } from "../config/supabaseClient.js";


export async function saveJobsToDatabase(jobs) {

    console.log("🔥 SAVE FUNCTION CALLED");
    console.log("🔥 JOB COUNT:", jobs.length);


    if (!jobs.length) {
        console.log("No jobs found");
        return [];
    }


    const formattedJobs = jobs.map(job => ({
        id: job.id,
        source: job.source,
        source_domain: job.sourceDomain,
        source_job_id: job.sourceJobId,

        title: job.title,
        company: job.company,

        company_logo: job.companyLogo,
        location: job.location,

        workplace_type: job.workplaceType,
        employment_type: job.employmentType,
        experience_level: job.experienceLevel,

        description: job.description,

        skills: job.skills,

        salary_min: job.salaryMin,
        salary_max: job.salaryMax,
        currency: job.currency,

        posted_at: job.postedAt,

        scraped_at: job.scrapedAt,
        last_verified_at: job.lastVerifiedAt,

        original_job_url: job.originalJobUrl,
        apply_url: job.applyUrl,

        is_direct_company_listing:
            job.isDirectCompanyListing,

        is_active:
            job.isActive
    }));


    const { data, error } = await supabase
        .from("jobs")
        .upsert(formattedJobs, {
            onConflict: "id"
        })
        .select();
        console.log("SUPABASE DATA:", data);
        console.log("SUPABASE ERROR:", error);


    if(error){

        console.log("SUPABASE ERROR:");
        console.log(error);

        return [];

    }


    console.log(
        "INSERTED JOBS:",
        data.length
    );


    return data;

}