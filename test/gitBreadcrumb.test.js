const test = require('node:test');
const assert = require('node:assert/strict');
const { formatGitBreadcrumb } = require('../out/electron/gitBreadcrumb');

test('formats a clean breadcrumb without a dirty marker', () => {
    const result = formatGitBreadcrumb({ branch: 'main', hash: 'abc1234', buildTime: '1000', dirty: 'clean' });
    assert.match(result, /^Git: main \/ abc1234\nBuild Date: /);
});

test('appends "dirty" only when the breadcrumb is actually dirty', () => {
    const result = formatGitBreadcrumb({ branch: 'main', hash: 'abc1234', buildTime: '1000', dirty: 'dirty' });
    assert.match(result, /^Git: main \/ abc1234 \/ dirty\nBuild Date: /);
});

test('falls back to "unknown" for a missing breadcrumb', () => {
    assert.equal(formatGitBreadcrumb(null), 'Git: unknown');
});

test('falls back to "unknown" build date for a non-numeric buildTime', () => {
    const result = formatGitBreadcrumb({ branch: 'main', hash: 'abc1234', buildTime: 'not-a-number', dirty: 'clean' });
    assert.equal(result, 'Git: main / abc1234\nBuild Date: unknown');
});
