// server.js
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

let devices = {
    "YOUR_DEVICE_ID": false // default inactive
};

app.get("/device", (req, res) => {
    const deviceId = req.query.deviceId;
    if (devices[deviceId] !== undefined) {
        res.send(devices[deviceId].toString());
    } else {
        res.status(404).send("Device not found");
    }
});

app.post("/device", (req, res) => {
    const { deviceId, active } = req.body;
    if (devices[deviceId] !== undefined) {
        devices[deviceId] = active;
        res.send("OK");
    } else {
        res.status(404).send("Device not found");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
