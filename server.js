// server.js
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Single device active flag
let active = false;

// GET current state
app.get("/", (req, res) => {
    res.send(active.toString());
});

// POST toggle state
app.post("/", (req, res) => {
    const { active: newState } = req.body;
    active = newState;
    res.send("OK");
});

app.listen(3000, () => console.log("Server running on port 3000"));
