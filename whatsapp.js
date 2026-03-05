const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');

let sock;

async function connectWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Reconectando...');
                connectWhatsApp();
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

module.exports = { sendMessage };