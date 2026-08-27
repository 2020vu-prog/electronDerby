const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const electronPath = require('electron');

test('the app boots and its preload script loads without error', () => {
    const entryPoint = path.join(__dirname, '..', 'out', 'electron', 'smokeTestMain.js');
    // --no-sandbox disables the OS-level Chromium sandbox (which needs a root-owned
    // setuid helper binary CI runners don't have configured); it does not affect the
    // per-window `sandbox: true` webPreference this test is actually checking.
    const result = spawnSync(electronPath, ['--no-sandbox', entryPoint], {
        encoding: 'utf8',
        timeout: 15000,
    });

    const output = `${result.stdout || ''}\n${result.stderr || ''}`;
    assert.match(output, /SMOKE_TEST_OK/, `expected a clean app boot, got:\n${output}`);
});
