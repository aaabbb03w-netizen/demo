// server.js
const express = require("express");
const app = express();

let active = true;

app.get("/device", (req, res) => {
    if (req.query.active === "true") active = true;
    if (req.query.active === "false") active = false;
    res.json({ active });
});

app.listen(3000, () => console.log("Server running on port 3000"));
