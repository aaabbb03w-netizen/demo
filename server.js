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
  });

  socket.on("signal", data => {
    if (devices[data.deviceId]) {
      io.to(devices[data.deviceId]).emit("signal", data);
    }
  });

  socket.on("tap", data => {
    if (devices[data.deviceId]) {
      io.to(devices[data.deviceId]).emit("tap", data);
    }
  });
});

app.post("/scshare", (req, res) => {
  const { deviceId } = req.body;
  if (devices[deviceId]) {
    io.to(devices[deviceId]).emit("share_request");
  }
  res.send({ ok: true });
});

server.listen(3000, () => console.log("Server on 3000"));
