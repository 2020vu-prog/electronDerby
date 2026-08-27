const test = require('node:test');
const assert = require('node:assert/strict');
const { parseTimerMessage } = require('../out/electron/parseTimerMessage');

test('parses a well-formed lane message', () => {
    assert.deepEqual(parseTimerMessage('LANE 1  00.065 sec.'), { lane: '1', ms: '00065' });
});

test('is case-insensitive on the "lane" keyword', () => {
    assert.deepEqual(parseTimerMessage('lane 2  00.123 SEC'), { lane: '2', ms: '00123' });
});

test('tolerates extra whitespace between the lane number and the value', () => {
    assert.deepEqual(parseTimerMessage('LANE   3     12.345'), { lane: '3', ms: '12345' });
});

test('rejects a value with the wrong number of decimal digits', () => {
    assert.equal(parseTimerMessage('LANE 1 00.06 sec'), null);
});

test('rejects a message with no lane keyword', () => {
    assert.equal(parseTimerMessage('not a timer message'), null);
});

test('rejects an empty string', () => {
    assert.equal(parseTimerMessage(''), null);
});
