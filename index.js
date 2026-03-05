const cron = require('node-cron');
const { getNewAssignments, getNewQuizzes } = require('./canvas');
const { sendMessage } = require('./whatsapp');
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

http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot rodando!');
}).listen(process.env.PORT || 3000);

console.log('Bot iniciado. Verificando a cada 5 minutos...');