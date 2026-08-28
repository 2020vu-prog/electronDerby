#!/usr/bin/env node
// Mirrors svelteDerby's backend/scripts/gitBreadcrumb.sh JSON shape
// ({branch, hash, buildTime, dirty}) so the format is consistent across
// both apps. Runs at build time (nothing at runtime shells out to git, and
// no .git directory ships inside the packaged app).
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function git(args) {
    try {
        return execFileSync('git', args, { encoding: 'utf8' }).trim();
    } catch {
        return '';
    }
}

// actions/checkout leaves CI in a detached HEAD for some trigger types, where
// `git branch --show-current` returns empty - fall back to the ref GitHub
// Actions provides in that case.
const branch = git(['branch', '--show-current']) || process.env.GITHUB_REF_NAME || 'unknown';
const hash = git(['rev-parse', '--short', 'HEAD']) || 'unknown';
const dirty = git(['status', '--porcelain', '--untracked-files=no']) ? 'dirty' : 'clean';
const buildTime = `${Date.now()}`;

const breadcrumb = { branch, hash, buildTime, dirty };

const outDir = path.join(__dirname, '..', 'out', 'electron');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'gitBreadcrumb.json'), JSON.stringify(breadcrumb));

console.log('Generated git breadcrumb:', breadcrumb);
