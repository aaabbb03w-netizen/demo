// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let overlayActive = true;

// GET current overlay status
app.get("/status", (req, res) => {
    res.json({ active: overlayActive });
});

// POST toggle overlay
app.post("/toggle", (req, res) => {
    overlayActive = !!req.body.active;
    res.json({ active: overlayActive });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
