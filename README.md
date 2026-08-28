# electronDerby

Electron desktop shell that displays the svelteDerby race timer and relays UDP-based race timing data (lane + time) into the page as a `udpTimer` event.

## Using a released build

For anyone who just wants to run the app - no Node.js or source checkout needed.

Pre-built downloads (Mac `.zip`, Windows `.exe`) are published to [GitHub Releases](https://github.com/2020vu-prog/electronDerby/releases). These aren't code-signed, so:

* **Mac**: download the `-x64-` zip for an Intel Mac or the `-arm64-` zip for Apple Silicon, unzip, drag the `.app` to Applications, then right-click it and choose Open the first time (bypasses Gatekeeper's "unidentified developer" warning).
* **Windows**: SmartScreen will warn on first run too - click "More info" -> "Run anyway".

## Building and running from source

For development, or for running the app from source instead of a downloaded build. Requires Node.js and Yarn.

### Setup

```
git clone git@github.com:2020vu-prog/electronDerby.git
cd electronDerby
yarn install
```

### Run

```
yarn run timer
```

### Test

Automated tests (message parsing, a real UDP round-trip, and a real Electron boot/preload check):

```
yarn test
```

Manually smoke-test the running app against a live UDP sender:

```
node udpSend2.js
```

### Cut a release

Bump `version` in `package.json`, then run the "Release" workflow from the Actions tab (`workflow_dispatch`, manual trigger only). It builds Mac (x64 + arm64) and Windows (x64) and uploads the results to GitHub Releases under a `v<version>` tag.
