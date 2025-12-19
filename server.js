const express = require("express");
const fs = require("fs");

const app = express();
const FILE = "./lock.json";

// helpers
function readState() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({ locked: false }));
  return JSON.parse(fs.readFileSync(FILE));
}
function writeState(v) {
  fs.writeFileSync(FILE, JSON.stringify({ locked: v }));
}

// SET LOCK
// /set-lock?value=true|false
app.get("/set-lock", (req, res) => {
  const v = req.query.value;
  if (v !== "true" && v !== "false")
    return res.status(400).json({ error: "value must be true/false" });

  const locked = v === "true";
  writeState(locked);
  res.json({ success: true, locked });
});

// APP POLL
// /check-lock
app.get("/check-lock", (req, res) => {
  const s = readState();
  res.json({ locked: s.locked });
});

app.listen(3000, () => console.log("Lock server running on 3000"));
