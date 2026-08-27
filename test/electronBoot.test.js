const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const electronPath = require('electron');

test('the app boots and its preload script loads without error', () => {
    const entryPoint = path.join(__dirname, '..', 'out', 'electron', 'smokeTestMain.js');
    const result = spawnSync(electronPath, [entryPoint], {
        encoding: 'utf8',
        timeout: 15000,
    });

    const output = `${result.stdout || ''}\n${result.stderr || ''}`;
    assert.match(output, /SMOKE_TEST_OK/, `expected a clean app boot, got:\n${output}`);
});
