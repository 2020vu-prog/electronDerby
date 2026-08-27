# Evolving instructions for running electron derbyp app
# Initialization:
```
git clone git@github.com:2020vu-prog/electronDerby.git
```

* Eventually this is intended to be distributed as a windows msi or a mac dmg
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

