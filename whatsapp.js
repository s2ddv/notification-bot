const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const QRCode = require('qrcode');

let sock;
let currentQR = null;

async function connectWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            currentQR = qr;
            console.log('QR Code gerado. Acesse /qr no navegador para escanear.');
        }

        if (connection === 'close') {
            currentQR = null;
            const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Reconectando...');
                connectWhatsApp();
            } else {
                console.log('Desconectado. Faça login novamente.');
            }
        } else if (connection === 'open') {
            currentQR = null;
            console.log('WhatsApp conectado!');
        }
    });
}

async function getQRCodeImage() {
    if (!currentQR) return null;
    return await QRCode.toDataURL(currentQR);
}

async function sendMessage(number, message) {
    if (!sock) throw new Error('WhatsApp não conectado');
    await sock.sendMessage(number, { text: message });
}

connectWhatsApp();

module.exports = { sendMessage, getQRCodeImage };