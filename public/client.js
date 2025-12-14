const ws = new WebSocket(`ws://${location.host}`);

ws.onopen = () => console.log("Connected to WS");

ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if(data.type === "frame"){
        const img = document.getElementById("screen");
        img.src = "data:image/jpeg;base64," + data.frame;
    }
};
