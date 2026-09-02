const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  // Forge's default outDir ("out") collides with tsc's own build output
  // (out/electron/*.js), which "main" points at - keep them separate.
  outDir: 'release',
  packagerConfig: {
    asar: true,
    // No runtime "dependencies" exist (only devDependencies, which are
    // build/dev-only tooling) - nothing in node_modules is needed at runtime.
    ignore: [
      /^\/src($|\/)/,
      /^\/test($|\/)/,
      /^\/scripts($|\/)/,
      /^\/\.github($|\/)/,
      /^\/release($|\/)/,
      /^\/node_modules($|\/)/,
      /^\/udpSend.*\.js$/,
      /^\/udpRecv.*\.js$/,
      /^\/tsconfig\.json$/,
      /^\/forge\.config\.js$/,
      /^\/yarn\.lock$/,
      /^\/package-lock\.json$/,
    ],
  },
  rebuildConfig: {},
  makers: [
    // maker-dmg is deliberately omitted: it needs the "appdmg" native module,
    // which failed to compile here (untested in CI) - it and the working zip
    // maker run in the same job, so a broken dmg build would take the
    // otherwise-fine mac zip down with it. Add it back once verified.
    { name: '@electron-forge/maker-zip', platforms: ['darwin', 'linux', 'win32'] },
    {
      name: '@electron-forge/maker-squirrel',
      // Unlike the zip maker, Squirrel's installer filename doesn't include
      // an architecture by default ("svelte-derby-electron-1.0.0.Setup.exe") -
      // make it explicit, since it's the one asset in a release with no
      // arch/platform indicator at all otherwise.
      config: { setupExe: 'svelte-derby-electron-win32-x64-Setup.exe' },
    },
  ],
  // No publishers configured: electron-forge publish has no per-architecture
  // control and always defaults to the host's own arch, which structurally
  // can't produce both Mac builds from one call. The release workflow runs
  // `electron-forge make` once per arch/platform instead and uploads the
  // results directly via the gh CLI.
  hooks: {
    // package/make operate on whatever is already on disk under out/electron/ -
    // make sure it's fresh before either one runs.
    prePackage: async () => {
      // shell: true - on Windows, npx/npm are .cmd files; execFileSync can't
      // resolve them without going through a shell (confirmed by a real CI
      // failure: "spawnSync npx ENOENT" on windows-latest). Runs the full
      // `build` script (not just tsc) so the packaged app also gets a
      // freshly-generated git breadcrumb, from one shared build definition.
      execFileSync('npm', ['run', 'build'], { stdio: 'inherit', shell: true });
    },
    // Without this, the Mac binary is completely unsigned ("code object is
    // not signed at all"). Combined with the com.apple.quarantine flag a
    // browser download adds, that's not just a Gatekeeper warning - macOS
    // refuses to execute the binary's code at all (confirmed on a real
    // downloaded release: process exists, 0% CPU, no output, no child
    // processes, reported as "not responding"). No Apple Developer
    // account/certificate is configured, so this needs to be an ad-hoc
    // signature - but packagerConfig.osxSign can't do that: it always goes
    // through @electron/osx-sign, which only ever *searches the keychain*
    // for a real Developer ID certificate (identity: null/true just means
    // "auto-discover", not "skip search and go ad-hoc"), finds nothing here
    // or in CI, and silently no-ops rather than sign (its signing failures
    // default to a swallowed warning, continueOnError: true, not a build
    // failure - why this went unnoticed originally). True ad-hoc signing
    // (`codesign --sign -`) needs to bypass that module and call codesign
    // directly, which is what this hook does.
    postPackage: async (_forgeConfig, packageResult) => {
      if (packageResult.platform !== 'darwin') {
        return;
      }
      for (const outputPath of packageResult.outputPaths) {
        const appBundle = fs.readdirSync(outputPath).find((f) => f.endsWith('.app'));
        if (!appBundle) {
          continue;
        }
        const appPath = path.join(outputPath, appBundle);
        execFileSync('codesign', ['--sign', '-', '--deep', '--force', appPath], { stdio: 'inherit' });
        console.log(`Ad-hoc signed ${appPath}`);
      }
    },
  },
};
