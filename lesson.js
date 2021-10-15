/*

En este taller, repasaremos los conceptos básicos
de las transacciones de Celo y lo que necesitas saber
como desarrollador de Celo.

En este taller abordaremos:

- Estructura de una transacción Celo
- Cómo y por qué es diferente a Ethereum
- Envío de transacciones CELO con web3.js, ethers.js
     y ContractKit
- Envío de transacciones de cUSD con ContractKit, web3.js,
     y ethers.js

*/

/*
================================================================================
*/

/*

    Sección 1.

    Configuración

*/

const Web3 = require('web3')
const ContractKit = require('@celo/contractkit')
const celo_ethers = require('@celo-tools/celo-ethers-wrapper')
require('dotenv').config({path: '.env'})
const { ethers } = require('ethers')

const web3 = new Web3('https://alfajores-forno.celo-testnet.org/')

// const web3 = new Web3(`https://celo-alfajores--rpc.datahub.figment.io/apikey/${process.env.FIGMENT_API_KEY}/`)

const kit = ContractKit.newKitFromWeb3(web3)

// Obtén un objeto de la cuenta para usar en el taller
// Corre `node createAccount.js` en la raíz del proyecto para imprimir en consola la información de la nueva cuenta
// Copie la clave privada impresa en la variable PRIVATE_KEY en el archivo .env
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)

/*
================================================================================
*/

/*

    Sección 2.

    Firmando un ejemplo de una transacción de Ethereum

    Recursos:
    - https://web3js.readthedocs.io/en/latest/

*/

let EthTx = {
    to: "0x9a8e698171364db8e0F5Fe30f658F233F1347F6a",
    gas: 200000,
    from: account.address,

    // los siguientes campos son opcionales
    nonce: 1,
    chainId: "44787",             // Alfajores testnet
    data: "0xabc1",               // data a enviar para la ejecución del contrato inteligente
    value: 10,
    gasPrice: "5000000000",       // 0.5 Gwei
}

async function signEthTx(){
    let signedEthTx = await web3.eth.accounts.signTransaction(EthTx, account.privateKey)
    console.log('Tx ETH firmada: %o', signedEthTx)
}
// signEthTx()

// Este ejemplo es solo para fines ilustrativos.
// A continuación, veremos cómo el objeto de transacción de Celo es similar a Ethereum.

/*
================================================================================
*/

/*

    Sección 3.

    Firmando una transacción de Celo

*/

let CeloTx = {
    to: "0x9a8e698171364db8e0F5Fe30f658F233F1347F6a",
    value: 10,
    gas: 200000,
    nonce: 1,
    chainId: "44787",             // Id de la cadena de prueba Alfajores de Celo
    data: "0xabc1",               // data a enviar para la ejecución del contrato inteligente
    gasPrice: "5000000000",       // 0.5 Gwei
    gatewayFee: 1,       
    gatewayFeeRecipient: "0x0000000000000000000000000000000000000000",
    feeCurrency: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",  // dirección de contrato inteligente de cUSD Alfajores
    from: account.address
}

// Para utilizar ContractKit para firmar la transacción, debes agregar tu clave privada al kit
kit.connection.addAccount(account.privateKey)
kit.defaultAccount = account.address

async function signCeloTx(){
    // Para firmar la transacción sin enviarla, obtén la billetera del kit
    let celoWallet = await kit.getWallet()
    let signedCeloTx = await celoWallet.signTransaction(CeloTx)
    
    console.log('Tx Celo firmada: %o', signedCeloTx)
}

// signCeloTx()

/*

    Esta sección muestra cómo firmar transacciones de Celo sin enviarlas a la red.

    Puedes ver que un objeto de transacción de Celo tiene 3 campos adicionales en comparación
    con un objeto de transacción de Ethereum.
        - feeCurrency
        - gatewayFee
        - gatewayFeeRecipient

    Estos campos permiten algunas de las características adicionales de Celo,
    como permitir que las tarifas de transacción se paguen en múltiples monedas 
    e incentivos para los nodos completos para promover la descentralización y
    brindar acceso confiable a clientes móviles ultraligeros.
*/

/*
================================================================================
*/

/*

    Sección 4.

    Enviar una transacción CELO

    Requisitos:

    - Antes de poder enviar una transacción, deberás depositar fondos en tu cuenta
    con CELO y / o cUSD para pagar las tarifas de transacción.

    https://celo.org/developers/faucet

*/

async function sendCELOTx(){

    // Conéctate a la red y obtiene el nonce de la tx actual
    let nonce = await kit.web3.eth.getTransactionCount(kit.defaultAccount)

    // Envía 0.1 CELO
    let amount = kit.web3.utils.toWei("0.1", "ether")
    
    let CeloTx = {
        to: "0x9a8e698171364db8e0F5Fe30f658F233F1347F6a", // omite el destinataria para un despliegue de contrato
        from: account.address,
        gas: 200000,               // el gas sobrante se devolverá al remitente
        nonce: nonce,
        chainId: "44787",          // Alfajores chainId
        data: "0x0",               // data a enviar para la ejecución del contrato inteligente
        value: amount,
        
        // Los siguientes campos se pueden omitir y ContractKit los completará, si es necesario

        // gasPrice: "",    
        // gatewayFee: 0,       
        // gatewayFeeRecipient: "",
        // feeCurrency: ""
    }

    let tx = await kit.sendTransaction(CeloTx)
    let receipt = await tx.waitReceipt()

    console.log(`CELO tx: https://alfajores-blockscout.celo-testnet.org/tx/${receipt.transactionHash}`)
}

// sendCELOTx()

/*
    Este ejemplo mostró cómo generar transacciones para enviar CELO "de forma nativa",
    similar a cómo enviarías Ether en Ethereum.

    En las próximas secciones, verás cómo ContractKit facilita 
    crear y enviar transacciones e interactuar con contratos comunes.
*/

/*
================================================================================
*/

/*

    Sección 5.

    Leer Balances usando ContractKit

*/

let anAddress = '0xD86518b29BB52a5DAC5991eACf09481CE4B0710d'

async function getBalances(){

    // Obtén los contratos de los tokens
    let goldtoken = await kit.contracts.getGoldToken()
    let stabletoken = await kit.contracts.getStableToken()

    // Obtén los balances de los tokens
    let celoBalance = await goldtoken.balanceOf(anAddress)
    let cUSDBalance = await stabletoken.balanceOf(anAddress)

    // Imprimir balances
    console.log(`${anAddress} Balance CELO: ${kit.web3.utils.fromWei(celoBalance.toString(), "ether")}`)
    console.log(`${anAddress} Balance cUSD: ${kit.web3.utils.fromWei(cUSDBalance.toString(), "ether")}`)
}
// getBalances()


/*
================================================================================
*/

/*

    Sección 6.

    Enviar Transacciones usando ContractKit

*/

async function sendCELOandCUSD(){
    // Especifica una cantidad a enviar
    let amount = kit.web3.utils.toWei("0.1", "ether")

    // Obtén los envoltorios de contratos
    let goldtoken = await kit.contracts.getGoldToken()
    let stabletoken = await kit.contracts.getStableToken()

    // Transfiere CELO y cUSD desde tu cuenta a una dirección
    // Especifica cUSD como feeCurrency al enviar cUSD
    let celotx = await goldtoken.transfer(anAddress, amount).send({from: account.address})
    let cUSDtx = await stabletoken.transfer(anAddress, amount).send({from: account.address, feeCurrency: stabletoken.address})

    // Espera a que se procesen las transacciones
    let celoReceipt = await celotx.waitReceipt()
    let cUSDReceipt = await cUSDtx.waitReceipt()

    // 17. Imprime los recibos
    console.log(`CELO Transaction: https://alfajores-blockscout.celo-testnet.org/tx/${celoReceipt.transactionHash}/`)
    console.log(`cUSD Transaction: https://alfajores-blockscout.celo-testnet.org/tx/${cUSDReceipt.transactionHash}/`)

    // 18. Obtén tus nuevos balances
    let celoBalance = await goldtoken.balanceOf(account.address)
    let cUSDBalance = await stabletoken.balanceOf(account.address)

    // 19. Imprime los nuevos balances
    console.log(`Your new account CELO balance: ${kit.web3.utils.fromWei(celoBalance.toString(), "ether")}`)
    console.log(`Your new account cUSD balance: ${kit.web3.utils.fromWei(cUSDBalance.toString(), "ether")}`)
}
// sendCELOandCUSD()

/*
================================================================================
*/

/*

    Sección 7.

    Usando Ethers.js con Celo

    Recursos:
    - https://docs.ethers.io/v5/
    - https://github.com/celo-tools/celo-ethers-wrapper 

*/

async function sendCELOWithEthers(){
    const provider = new celo_ethers.CeloProvider(`https://celo-alfajores--rpc.datahub.figment.io/apikey/${process.env.FIGMENT_API_KEY}/`)
    await provider.ready
    const wallet = new celo_ethers.CeloWallet(account.privateKey, provider)

    const txResponse = await wallet.sendTransaction({
        to: anAddress,
        value: ethers.utils.parseEther("0.1")
    })

    const txReceipt = await txResponse.wait()
    console.log(`celo-ethers Transaction: https://alfajores-blockscout.celo-testnet.org/tx/${txReceipt.transactionHash}/`)
}
// sendCELOWithEthers()
