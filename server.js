const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

const devices = {}; // deviceId → socketId

io.on("connection", socket => {

  socket.on("register", deviceId => {
    devices[deviceId] = socket.id;
    console.log("Device connected:", deviceId);
  });

  socket.on("disconnect", () => {
    for (let d in devices) {
      if (devices[d] === socket.id) delete devices[d];
    }
  });
});

// Trigger screen share request
app.post("/scshare", (req, res) => {
  const { deviceId } = req.body;
  if (devices[deviceId]) {
    io.to(devices[deviceId]).emit("share_request");
  }
  res.send({ ok: true });
});

// Send TAP command
app.post("/tap", (req, res) => {
  const { deviceId, x, y } = req.body;
  if (devices[deviceId]) {
    io.to(devices[deviceId]).emit("tap", { x, y });
  }
  res.send({ sent: true });
});

server.listen(3000, () => {
  console.log("Remote server running on 3000");
});
