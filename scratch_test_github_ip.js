const net = require('net');

const ip = '140.82.112.4'; // A known GitHub IP
const port = 443;

console.log(`Connecting to ${ip}:${port}...`);
const socket = new net.Socket();

socket.setTimeout(5000);

socket.connect(port, ip, () => {
  console.log('SUCCESS! Connected directly to GitHub IP.');
  socket.destroy();
});

socket.on('error', (err) => {
  console.error('Connection failed:', err.message);
});

socket.on('timeout', () => {
  console.error('Connection timed out.');
  socket.destroy();
});
