const express = require('express');
const http = require('http');
const WebSocket = require('ws');


const app = express();
app.use(express.json());


let sockets = [];


app.post('/startscreen', (req,res)=>{
// deviceId receive → FCM/Broadcast (demo)
res.json({ok:true});
});


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', ws => {
sockets.push(ws);
ws.on('message', data => {
sockets.forEach(s => s !== ws && s.send(data));
});
});


server.listen(3000, ()=>console.log('Server running'));
