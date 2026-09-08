import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import {
    syncAllSources,
    searchAllSources,
    getAggregatedJobs,
    getCrawlerStatus,
    startScheduler
} from "./aggregator/service.js";


dotenv.config();


const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"]
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;


// --------------------
// Middlewares
// --------------------

app.use(helmet());


app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: {
            error: "Too many requests"
        }
    })
);


app.use(
    cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://carvia-frontend-main.vercel.app"
  ]
}));


app.use(express.json());


// --------------------
// Health Check
// --------------------

app.get("/", (req, res) => {

    res.json({
        message: "Carvia Backend Running 🚀"
    });

});



// --------------------
// Get Jobs
// --------------------

app.get("/v1/jobs", async (req, res) => {

    try {

        const keyword =
            (req.query.keyword || "").trim();

        let jobs;

        if (keyword) {

            jobs = await searchAllSources(keyword);

        } else {

            jobs = getAggregatedJobs();

        }

        res.json({

            keyword,

            total: jobs.length,

            results: jobs

        });

    } catch (error) {

        console.error(
            "Jobs request failed:",
            error
        );

        res.status(500).json({

            error: error.message

        });

    }

});

// --------------------
// Search Jobs
// --------------------

app.get("/search", async (req, res) => {

    try {

        const keyword =
            (req.query.keyword || "").trim();

        if (!keyword) {

            return res.status(400).json({
                error: "Keyword is required"
            });

        }

        const jobs =
            await searchAllSources(keyword);

        res.json({

            keyword,

            total: jobs.length,

            results: jobs

        });

    } catch (error) {

        console.error(
            "Search failed:",
            error
        );

        res.status(500).json({

            error: "Search failed"

        });

    }

});

// --------------------
// Scheduler Status
// --------------------

app.get(
"/v1/admin/crawler/status",
(req,res)=>{


    res.json(
        getCrawlerStatus()
    );


});



// --------------------
// Error Handler
// --------------------

app.use((err,req,res,next)=>{


    console.error(err);


    res.status(500).json({

        error:"Internal Server Error"

    });


});



// --------------------
// Start Server
// --------------------

app.listen(PORT,()=>{


    console.log(
        `Server running on port ${PORT} 🚀`
    );


    startScheduler();


});