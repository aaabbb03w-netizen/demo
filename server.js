const express = require("express");
const app = express();

let LOCKED = false;

/**
 * 🔒 LOCK / UNLOCK
 * /lock?value=true
 * /lock?value=false
 */
app.get("/lock", (req, res) => {
  const v = req.query.value;

  if (v === "true") LOCKED = true;
  if (v === "false") LOCKED = false;

  res.json({
    success: true,
    locked: LOCKED
  });
});

/**
 * 📱 App har 5 sec me yahi hit karega
 */
app.get("/lock-status", (req, res) => {
  res.json({
    locked: LOCKED
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
