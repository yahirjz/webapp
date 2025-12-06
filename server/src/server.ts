import express from "express";
import cors from "cors";
import path from "path";

import fs from "fs";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/productos', (req, res) => {
    res.status(200).json({
        message: 'Lista de productos'
    });
});

// Serve static files from the server/public directory (self-contained)
const distPath = path.resolve(__dirname, "../public");
console.log("📂 Current __dirname:", __dirname);
console.log("📂 Target distPath:", distPath);
console.log("📂 Exists?", fs.existsSync(distPath));
app.use(express.static(distPath));

// Handle SPA routing - return index.html for any other route
// This MUST be the last route
// Using regex /.*/ because string "*" is not supported in Express 5's router
app.get(/.*/, (req, res) => {
    const indexPath = path.resolve(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error("❌ index.html not found at:", indexPath);
        res.status(404).send("Frontend not found. Check server logs.");
    }
});

app.listen(port, () => {
    console.log(`Server runnning on http://localhost:${port}`)
})