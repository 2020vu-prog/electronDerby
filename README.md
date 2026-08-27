# Evolving instructions for running electron derbyp app

## For users: downloading a build

Pre-built downloads (Mac `.zip`, Windows `.exe`) are published to [GitHub Releases](https://github.com/2020vu-prog/electronDerby/releases). These aren't code-signed, so:
* **Mac**: unzip, drag the `.app` to Applications, then right-click it and choose Open the first time (bypasses Gatekeeper's "unidentified developer" warning).
* **Windows**: SmartScreen will warn on first run too - click "More info" -> "Run anyway".

## For developers

# Initialization:
```
git clone git@github.com:2020vu-prog/electronDerby.git
```

* For now you will need node and yarn installed on the machine as pre-requisites
* run the following:
```
yarn install
yarn run timer
```

* to run the automated tests (message parsing + a real UDP round-trip):
```
yarn test
```

* to manually smoke-test the running app against a live UDP sender:
```
node udpSend2.js
```

* to cut a release: bump `version` in `package.json`, then run the "Release" workflow from the Actions tab (`workflow_dispatch`, manual trigger only). It builds on `macos-latest` and `windows-latest` and publishes the `.zip`/`.exe` to GitHub Releases under a `v<version>` tag.

