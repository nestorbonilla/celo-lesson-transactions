# Celo, lesson 01 - transactions

A repo to help better understand Celo's transaction structure and tools for submitting transactions.

## Requirements

- familiar with Javascript and basic web development
- have installed `yarn`

## Start

1. Run `yarn install` at the root of the project.
2. Run `node createAccount.js`. This will print the details of a new Celo account to the console. Copy the private key of the new account into the variable `PRIVATE_KEY` inside `.env`.
3. Fund the account on the Alfajores testnet with the public address: https://celo.org/developers/faucet
4. Create a Figment Data Hub account (Optional) [here](https://figment.io/datahub/celo/) and get your API key and add it to `FIGMENT_API_KEY` en `.env`. This will allow you to connect to Celo networks.
5. See through `lesson.js`, following the provided details and removing the comments from the function call to execute the associated code.

## Example with Celo extension for browsing (fork of Metamask)

### Requirements

- [Browser Celo wallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh)
- `cd` inside the directory `webpage`.
- Run `yarn install` to install the dependencies. The simple web page uses [broswerify](http://browserify.org/) to package contractkit into a browser-usable javascript file. It also uses [watchify](https://www.npmjs.com/package/watchify) to watch `index.js` and `index.html` and check for changes, and it will automatically re-compile everything for you when a change is detected.
- Run `yarn dev` to start [lite server](https://www.npmjs.com/package/lite-server) and watchify to serve the page in localhost:3000
