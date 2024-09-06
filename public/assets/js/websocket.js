const socket = new WebSocket('ws://localhost:4000');

socket.onopen = function(event) {
    console.log('WebSocket is connected.');
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.action === 'new_donation') {
        console.log('New donation:', data.donation);
        // Perbarui UI atau lakukan aksi lain berdasarkan donasi baru
    }
};

socket.onclose = function(event) {
    console.log('WebSocket is closed.');
};
