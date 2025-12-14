// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
app.use(express.json());

// 🔥 Serve public folder for frontend files (optional)
app.use(express.static(path.join(__dirname, "public")));

// In-memory store for devices
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

// ✅ Start screen request
app.post("/startscreen", (req, res) => {
  const { deviceId } = req.body;
  if (!deviceId || !devices[deviceId]) {
    return res.status(404).json({ error: "Device not found" });
  }

  console.log("Start screen request for:", deviceId);

  // Broadcast via WebSocket to all connected clients
  const payload = JSON.stringify({ type: "startscreen", deviceId });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  res.json({ ok: true });
});

// ✅ Fetch all registered devices
app.get("/devices", (req, res) => {
  const list = Object.values(devices); // convert object to array
  res.json({ ok: true, devices: list });
});

// ✅ HTTP + WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
  console.log("WS client connected");

  ws.on("message", message => {
    // Broadcast received message to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => console.log("WS client disconnected"));
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
