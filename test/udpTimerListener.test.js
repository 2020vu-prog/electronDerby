const test = require('node:test');
const assert = require('node:assert/strict');
const dgram = require('node:dgram');
const { startUdpTimerListener } = require('../out/electron/udpTimerListener');

function waitForListening(server) {
    return new Promise((resolve) => {
        server.on('listening', () => resolve(server.address().port));
    });
}

function sendUdpMessage(port, text) {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4');
        client.send(Buffer.from(text), port, '127.0.0.1', (err) => {
            client.close();
            err ? reject(err) : resolve();
        });
    });
}

test('delivers a parsed reading end-to-end over a real UDP socket', async () => {
    let resolveReading;
    const readingPromise = new Promise((resolve) => {
        resolveReading = resolve;
    });

    const server = startUdpTimerListener({ port: 0, onReading: (reading) => resolveReading(reading) });
    const port = await waitForListening(server);

    await sendUdpMessage(port, 'LANE 3  01.234 sec.');
    const reading = await readingPromise;

    assert.deepEqual(reading, { lane: '3', ms: '01234' });
    server.close();
});

test('ignores a malformed message without crashing the listener', async () => {
    let readingReceived = false;
    let resolveInvalid;
    const invalidPromise = new Promise((resolve) => {
        resolveInvalid = resolve;
    });

    const server = startUdpTimerListener({
        port: 0,
        onReading: () => {
            readingReceived = true;
        },
        onInvalidMessage: (raw) => resolveInvalid(raw),
    });
    const port = await waitForListening(server);

    await sendUdpMessage(port, 'not a timer message');
    const raw = await invalidPromise;

    assert.equal(raw, 'not a timer message');
    assert.equal(readingReceived, false);
    server.close();
});
