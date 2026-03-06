const cron = require('node-cron');
const { getNewAssignments, getNewQuizzes } = require('./canvas');
const { sendMessage, getQRCodeImage } = require('./whatsapp');
const { isAlreadySent, markAsSent } = require('./database');
const { formatAssignment, formatQuiz } = require('./formatter');
const http = require('http');

const COURSE_IDS = [17562, 17335, 17612, 17639, 17158, 17616];
const MY_NUMBER = process.env.WA_NUMBER;

cron.schedule('*/5 * * * *', async () => {
    const since = new Date(Date.now() - 5 * 60 * 1000);
    for (const courseId of COURSE_IDS) {
        const assignments = await getNewAssignments(courseId, since);
        for (const a of assignments) {
            if (!isAlreadySent('assignment', a.id)) {
                await sendMessage(MY_NUMBER, formatAssignment(a));
                markAsSent('assignment', a.id, courseId);
            }
        }
        const quizzes = await getNewQuizzes(courseId, since);
        for (const q of quizzes) {
            if (!isAlreadySent('quiz', q.id)) {
                await sendMessage(MY_NUMBER, formatQuiz(q));
                markAsSent('quiz', q.id, courseId);
            }
        }
    }
    console.log(`[${new Date().toISOString()}] Verificação concluída.`);
});

http.createServer(async (req, res) => {
    if (req.url === '/qr') {
        const img = await getQRCodeImage();
        if (!img) {
            res.writeHead(200);
            res.end(`
                <html>
                <head><meta http-equiv="refresh" content="3"></head>
                <body>
                    <p>Aguardando QR Code... A página atualiza sozinha a cada 3 segundos.</p>
                </body>
                </html>
                `
            );
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<img src="${img}" /><p>Escaneie com o WhatsApp</p>`);
        }
    } else {
        res.writeHead(200);
        res.end('Bot rodando!');
    }
}).listen(process.env.PORT || 3000);

console.log('Bot iniciado. Verificando a cada 5 minutos...');