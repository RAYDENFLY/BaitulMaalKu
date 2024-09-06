const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', ws => {
    console.log('New client connected.');

    ws.on('message', message => {
        console.log('Received message:', message);
    });

    ws.on('close', () => {
        console.log('Client disconnected.');
    });
});

module.exports = wss;
