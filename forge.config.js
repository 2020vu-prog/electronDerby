const { execFileSync } = require('node:child_process');

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
      /^\/\.github($|\/)/,
      /^\/release($|\/)/,
      /^\/node_modules($|\/)/,
      /^\/udpSend.*\.js$/,
      /^\/udpRecv\.js$/,
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
      // failure: "spawnSync npx ENOENT" on windows-latest).
      execFileSync('npx', ['tsc'], { stdio: 'inherit', shell: true });
    },
  },
};
