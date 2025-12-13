const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const devices = {}; // deviceId -> socketId

app.use(express.json());

app.post("/register", (req, res) => {
  res.send({ status: "ok" });
});

app.post("/scshare", (req, res) => {
  const { deviceId } = req.body;
  const socketId = devices[deviceId];
  if (socketId) {
    io.to(socketId).emit("share_request");
  }
  res.send({ sent: true });
});

io.on("connection", (socket) => {
  socket.on("register", (deviceId) => {
    devices[deviceId] = socket.id;
  });
});

server.listen(3000, () => console.log("Server running"));
