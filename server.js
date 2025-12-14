const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
app.use(express.json());

// 🔥 IMPORTANT: public folder serve karo
app.use(express.static(path.join(__dirname, "public")));

// Test API
app.post("/startscreen", (req, res) => {
  const { deviceId } = req.body;
  console.log("Start screen request for:", deviceId);
  res.json({ ok: true });
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
wss.on("connection", ws => {
  console.log("WS connected");

  ws.on("message", data => {
    // broadcast to all
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
