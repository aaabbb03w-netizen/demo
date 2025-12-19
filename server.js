const express = require("express");
const fs = require("fs");

const app = express();
const FILE = "./lock.json";

/* -------- helpers -------- */
function readState() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ locked: false }));
  }
  return JSON.parse(fs.readFileSync(FILE));
}

function writeState(v) {
  fs.writeFileSync(FILE, JSON.stringify({ locked: v }));
}

/* -------- APIs -------- */

/**
 * 🔒 LOCK / UNLOCK
 * /lock?value=true
 * /lock?value=false
 */
app.get("/lock", (req, res) => {
  const v = req.query.value;

  if (v !== "true" && v !== "false") {
    return res.status(400).json({ error: "value must be true or false" });
  }

  const locked = v === "true";
  writeState(locked);

  res.json({
    success: true,
    locked
  });
});

/**
 * 📱 App polling endpoint
 */
app.get("/lock-status", (req, res) => {
  const state = readState();
  res.json({
    locked: state.locked
  });
});

app.listen(3000, () => {
  console.log("Lock server running on port 3000");
});
