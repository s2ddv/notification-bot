const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const readline = require('readline');

let sock;

async function connectWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ['Ubuntu', 'Chrome', '20.0.04']
    });

    sock.ev.on('creds.update', saveCreds);

    if (!sock.authState.creds.registered) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Digite seu número de telefone (ex: 5515999999999): ', async (number) => {
            rl.close();
            const code = await sock.requestPairingCode(number);
            console.log(`\nSeu código de pareamento: ${code}\n`);
            console.log('Digite esse código no WhatsApp: Configurações > Dispositivos conectados > Conectar com número de telefone');
        });
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Reconectando...');
                setTimeout(connectWhatsApp, 3000);
            } else {
                console.log('Desconectado. Faça login novamente.');
            }
        } else if (connection === 'open') {
            console.log('WhatsApp conectado!');
        }
    });
}

async function sendMessage(number, message) {
    if (!sock) throw new Error('WhatsApp não conectado');
    await sock.sendMessage(number, { text: message });
}

connectWhatsApp();

module.exports = { sendMessage, getQRCodeImage: () => null };