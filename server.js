const express = require("express");
const app = express();

let LOCKED = false;

app.get("/lock", (req, res) => {
  const v = req.query.value;
  if (v === "true") LOCKED = true;
  if (v === "false") LOCKED = false;
  res.json({ success: true, locked: LOCKED });
});

app.get("/lock-status", (req, res) => {
  res.json({ locked: LOCKED });
});

app.listen(3000, () => console.log("Server running on 3000"));
