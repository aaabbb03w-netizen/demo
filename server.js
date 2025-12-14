const express = require("express");
const app = express();

app.use(express.json());

const devices = {};

app.post("/register", (req, res) => {
  const { deviceId, platform } = req.body;

  devices[deviceId] = {
    deviceId,
    platform,
    registeredAt: new Date()
  };

  console.log("Device Registered:", deviceId);
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
