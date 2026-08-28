const fs = require('fs');
const path = require('path');

export interface GitBreadcrumb {
    branch: string;
    hash: string;
    buildTime: string;
    dirty: string;
}

// Generated at build time by scripts/generateGitBreadcrumb.js, sitting next
// to this compiled file both in dev (out/electron/) and inside the packaged
// app.asar.
export function readGitBreadcrumb(): GitBreadcrumb | null {
    try {
        const raw = fs.readFileSync(path.join(__dirname, 'gitBreadcrumb.json'), 'utf8');
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// Matches svelteDerby's frontend/src/AboutPage.svelte formatGitInfo: branch
// and hash joined with " / ", with "dirty" appended only when actually dirty.
export function formatGitBreadcrumb(breadcrumb: GitBreadcrumb | null): string {
    if (!breadcrumb) {
        return 'Git: unknown';
    }
    const gitInfo =
        [breadcrumb.branch, breadcrumb.hash, breadcrumb.dirty === 'dirty' ? 'dirty' : ''].filter(Boolean).join(' / ') ||
        'unknown';
    const buildTimeMs = Number(breadcrumb.buildTime);
    const buildDate = Number.isFinite(buildTimeMs) && buildTimeMs > 0 ? new Date(buildTimeMs).toLocaleString() : 'unknown';
    return `Git: ${gitInfo}\nBuild Date: ${buildDate}`;
}
