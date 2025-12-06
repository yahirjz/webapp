import express from "express";
import cors from "cors";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/productos', (req, res) => {
    res.status(200).json({
        message: 'Lista de productos'
    });
});

// Serve static files from the client dist directory
// Use path.resolve for better cross-platform compatibility
// Assuming structure: root/server/src/server.ts and root/client/dist
const distPath = path.resolve(__dirname, "../../client/dist");
app.use(express.static(distPath));

// Handle SPA routing - return index.html for any other route
// This MUST be the last route
// Using regex /.*/ because string "*" is not supported in Express 5's router
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server runnning on http://localhost:${port}`)
})