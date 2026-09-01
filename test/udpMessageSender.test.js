const test = require('node:test');
const assert = require('node:assert/strict');
const dgram = require('node:dgram');
const { sendUdpMessage } = require('../out/electron/udpMessageSender');

function listenOnce(server) {
    return new Promise((resolve) => {
        server.on('message', (msg) => resolve(msg.toString('utf8')));
    });
}

function waitForListening(server) {
    return new Promise((resolve) => {
        server.on('listening', () => resolve(server.address().port));
    });
}

test('sends the given message as UDP bytes to the given destination', async () => {
    const server = dgram.createSocket('udp4');
    server.bind(0);
    const port = await waitForListening(server);
    const receivedPromise = listenOnce(server);

    const payload = JSON.stringify({
        heatNumber: 5,
        lane1: { carNumber: '12', driverName: 'Alex' },
        lane2: { carNumber: '7', driverName: 'Sam' },
    });
    await sendUdpMessage(payload, { host: '127.0.0.1', port });

    const received = await receivedPromise;
    assert.equal(received, payload);
    server.close();
});
