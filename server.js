const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory store
const devices = {}; // deviceId -> { deviceId, model, registeredAt }

// ✅ Register device
app.post("/register", (req, res) => {
  const { deviceId, model } = req.body;
  if (!deviceId || !model) return res.status(400).json({ error: "Missing deviceId or model" });

  devices[deviceId] = {
    deviceId,
    model,
    registeredAt: new Date().toISOString()
  };
  console.log("Device registered:", devices[deviceId]);
  res.json({ ok: true, device: devices[deviceId] });
});

// ✅ Start screen request (Android device sends frames as base64)
app.post("/screenshare", (req, res) => {
  const { deviceId, frame } = req.body;
  if (!deviceId || !frame) return res.status(400).json({ error: "Missing deviceId or frame" });

  // Broadcast frame to all connected clients
  const payload = JSON.stringify({ type: "frame", deviceId, frame });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });

  res.json({ ok: true });
});

// ✅ Fetch all devices
app.get("/devices", (req, res) => {
  res.json({ ok: true, devices: Object.values(devices) });
});

// HTTP + WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
  console.log("WS client connected");
  ws.on("close", () => console.log("WS client disconnected"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on port", PORT));
