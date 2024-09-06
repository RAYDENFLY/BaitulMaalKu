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

// Function to broadcast messages to all clients
function broadcast(message) {
    wsServer.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Example: Notify clients of a new donation
function notifyNewDonation(donation) {
    broadcast(JSON.stringify({
        action: 'new_donation',
        donation: donation
    }));
}

module.exports = wss;
