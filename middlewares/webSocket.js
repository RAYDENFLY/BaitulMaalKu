const WebSocket = require('ws');

// Setup WebSocket server
const wss = new WebSocket.Server({ port: 8080 }); // Port WebSocket

wss.on('connection', ws => {
    console.log('New client connected');

    // Broadcast messages to all clients
    ws.on('message', message => {
        console.log(`Received message => ${message}`);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
