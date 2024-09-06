    const socket = new WebSocket('ws://localhost:8080'); // URL WebSocket

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.action === 'new_donation') {
            console.log('New donation received:', data.donation);
            // Update your UI with new donation data
        }
    };

    // Example of sending a message (if needed)
    function sendMessage(message) {
        socket.send(message);
    }
