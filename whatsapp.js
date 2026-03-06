const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const readline = require('readline');

let sock;
let paired = false;

async function connectWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ['Ubuntu', 'Chrome', '20.0.04']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            paired = true;
            console.log('WhatsApp conectado!');
        }

        if (connection === 'close') {
            const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (statusCode === DisconnectReason.loggedOut) {
                console.log('Desconectado. Faça login novamente.');
            } else if (paired) {
                console.log('Reconectando...');
                setTimeout(connectWhatsApp, 3000);
            }
        }
    });

    if (!sock.authState.creds.registered) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Digite seu número (ex: 5515999999999): ', async (number) => {
            rl.close();
            try {
                const code = await sock.requestPairingCode(number.trim());
                console.log(`\nCódigo de pareamento: ${code}`);
                console.log('Vá no WhatsApp > Dispositivos conectados > Conectar com número de telefone e digite o código.');
            } catch (err) {
                console.error('Erro ao gerar código:', err.message);
            }
        });
    }
}

async function sendMessage(number, message) {
    if (!sock) throw new Error('WhatsApp não conectado');
    await sock.sendMessage(number, { text: message });
}

connectWhatsApp();

module.exports = { sendMessage, getQRCodeImage: () => null };