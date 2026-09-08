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

const PORT = process.env.PORT || 5000;


// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://carvia-frontend-main.vercel.app"
];

const corsOptions = {
    origin: function (origin, callback) {

        // Allow requests without an origin
        // Example: Postman, server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("CORS blocked origin:", origin);

        return callback(new Error("Not allowed by CORS"));
    },

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    credentials: true,

    optionsSuccessStatus: 204
};


// =====================================================
// MIDDLEWARES
// =====================================================

// CORS MUST COME FIRST
app.use(cors(corsOptions));

// Security headers
app.use(helmet());

// JSON body parser
app.use(express.json());


// =====================================================
// RATE LIMIT
// =====================================================

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,

        message: {
            error: "Too many requests"
        },

        // Do not rate-limit CORS preflight requests
        skip: (req) => req.method === "OPTIONS"
    })
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {

    res.json({
        message: "Carvia Backend Running 🚀"
    });

});


// =====================================================
// GET JOBS
// =====================================================

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


// =====================================================
// SEARCH JOBS
// =====================================================

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


// =====================================================
// CRAWLER STATUS
// =====================================================

app.get(
    "/v1/admin/crawler/status",
    (req, res) => {

        res.json(
            getCrawlerStatus()
        );

    }
);


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

    console.error(
        "SERVER ERROR:",
        err
    );

    res.status(500).json({

        error: "Internal Server Error"

    });

});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT} 🚀`
    );

    startScheduler();

});