// Like udpRecv.js, but the port is an arg instead of hardcoded to 41234 -
// useful for watching the racePhaseEntered UDP destination, which is set
// via the app's Settings > Set UDP Destination... menu and can be any port.
// Usage: node udpRecv2.js [port]
const dgram = require('dgram');
const port = Number(process.argv[2]) || 41234;
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`got from ${rinfo.address}:${rinfo.port}: ${msg}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`listening on ${address.address}:${address.port}`);
});

server.bind(port);
