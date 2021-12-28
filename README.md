# Introduction
This repo is a collection of test suites for Karura/Acala on Kusama/Polkadot. 
# Instructions
So far there is no CI/CD pipeline integrated yet. Following instructions are for local execution only.
## Run Local Network
Execute the launch script:
```
cd .docker
./launch.sh
```
## Run Sidecar Server
Start and run a sidecar instance that connects to the local parachain node:

```
git clone https://github.com/paritytech/substrate-api-sidecar.git
cd substrate-api-sidecar
yarn
yarn build
export SAS_SUBSTRATE_WS_URL=ws://127.0.0.1:19946
yarn start
```
*N.B. Work in progress to have this added to the docker-compose file*
# Running tests
To run through all three smoke test packs, in a new terminal:
```
yarn
yarn test
```
# Description
This is intended to focus on being easy to understand; above efficiency or complexity. By design the tests are not overly abstracted and should communicate functional behaviour, rather than run through opaque test scripts. These tests are intended to be easy to refactor and extend and not overly brittle.

This is **not** intended to be a replacement for integration or unit testing, but is meant as for QA checkouts and regression testing.
## Features
- [x] Acala-JS query/send smoke tests
- [x] TX-Wrapper smoke tests
- [x] Sidecar read-only REST tests
- [ ] CI/CD Integration
- [ ] One-touch environment setup
- [ ] Acala-js tests involving tokens
- [ ] Acala-js tests for DEX, CDP, Farming
 
# Links
- [Acala JS](https://github.com/AcalaNetwork/acala.js)
- [Acala JS Examples](https://github.com/AcalaNetwork/acala-js-example)
- [Acala TX Wrapper](https://github.com/AcalaNetwork/txwrapper)
- [Local network builder](https://github.com/open-web3-stack/parachain-launch)
# Troubleshooting