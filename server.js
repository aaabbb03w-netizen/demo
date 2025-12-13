const express = require("express");
const { v4: uuid } = require("uuid");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

const devices = {}; 
// deviceId -> { fcmToken, ws }

const sessions = {}; 
// sessionId -> { deviceId, wsDevice, wsController }

app.post("/register", (req, res) => {
  const { deviceId, fcmToken } = req.body;
  devices[deviceId] = { fcmToken };
  res.json({ status: "registered" });
});

app.post("/scshare", (req, res) => {
  const { deviceId } = req.body;

  if (!devices[deviceId]) {
    return res.status(404).json({ error: "Device not found" });
  }

  const sessionId = uuid();
  sessions[sessionId] = { deviceId };

  // 👉 yaha FCM push jayega (allow request)
  console.log("Share request for:", deviceId);

  res.json({ sessionId });
});

const server = app.listen(process.env.PORT || 8080);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
  const params = new URLSearchParams(req.url.replace("/?", ""));
  const role = params.get("role");
  const sessionId = params.get("sessionId");

  if (!sessions[sessionId]) return ws.close();

  if (role === "device") sessions[sessionId].wsDevice = ws;
  else sessions[sessionId].wsController = ws;

  ws.on("message", msg => {
    const target =
      role === "device"
        ? sessions[sessionId].wsController
        : sessions[sessionId].wsDevice;

    if (target && target.readyState === 1) {
      target.send(msg);
    }
  });
});
