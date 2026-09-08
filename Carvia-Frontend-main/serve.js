import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import process from "process"
import compression from "compression"
import helmet from "helmet"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Use compression for Gzip/Brotli payload reduction
app.use(compression())

// Use helmet for standard security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disabling CSP temporarily to prevent breaking React inline styles/scripts without explicit setup
}))

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")))

// Handle SPA routing — serve index.html for all non-file routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`)
})
