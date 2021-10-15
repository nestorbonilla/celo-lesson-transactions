# Celo, lección 01 - transacciones

Un repositorio para ayudar a comprender mejor la estructura de transacciones de Celo y las herramientas para enviar transacciones.

## Requisitos

- familiarizado con Javascript y desarrollo web básico
- tener instalado `yarn`

## Inicia

1. Ejecuta `yarn install` en la raíz del proyecto.
2. Ejecuta `node createAccount.js`. Esto imprimirá en consola los detalles de una nueva cuenta de Celo. Copia la llave privada de la nueva cuenta en la variable `PRIVATE_KEY` dentro del `.env`.
3. Fondea la cuenta en la red de prueba Alfajores con la dirección pública: https://celo.org/developers/faucet
4. Crear una cuenta en Figment Data Hub (Opcional) [here](https://figment.io/datahub/celo/) y obtén tu llave API y agregala a `FIGMENT_API_KEY` en `.env`. Esto te permitirá conectarte a las redes Celo.
5. Ve a través de `lesson.js`, siguiendo los detalles provistos y removiendo los comentarios del llamado de funciones para ejecutar el código asocialdo.

## Ejemplo con extensión Celo para navegado (fork de Metamask)

### Requisitos

- [Billetera de Celo para navegador](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh)
- `cd` en el directorio `webpage`.
- Ejecuta `yarn install` para instalar las dependencias. La página web sencilla utiliza [broswerify](http://browserify.org/) para para empaquetar contractkit en un archivo javascript utilizable por el navegador. También utiliza [watchify](https://www.npmjs.com/package/watchify) para observar `index.js` y `index.html` y buscar por cambios, y re-compilará automáticamente todo por ti cuando un cambio sea detectado.
- Ejecuta `yarn dev` para iniciar [lite server](https://www.npmjs.com/package/lite-server) y watchify para para servir la página en localhost:3000
