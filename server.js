const express = require("express");
const app = express();
app.use(express.json());

let overlayStatus = false; // default OFF

// Get current status
app.get("/status", (req, res) => {
    res.json({ active: overlayStatus });
});

// Toggle using URL
// Example: /toggle?active=true  or /toggle?active=false
app.get("/toggle", (req, res) => {
    const active = req.query.active;
    if (active === "true") overlayStatus = true;
    else if (active === "false") overlayStatus = false;
    res.json({ active: overlayStatus });
});

app.listen(3000, () => console.log("Server running on port 3000"));
