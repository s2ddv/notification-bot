const axios = require('axios');
const CANVAS_URL = process.env.CANVAS_URL;
console.log('CANVAS_URL:', process.env.CANVAS_URL);
const api = axios.create({
    baseURL: process.env.CANVAS_URL, 
    headers: { Authorization: `Bearer ${process.env.CANVAS_TOKEN}` }
});

async function getNewAssignments(courseId, sinceDate) {
    const { data } = await api.get(`/api/v1/courses/${courseId}/assignments`, {
    params: { order_by: 'created_at', per_page: 50 }
    });

    return data.filter(a => new Date(a.created_at) > sinceDate);
}
async function getNewQuizzes(courseId, sinceDate) {
    const { data } = await api.get(`/api/v1/courses/${courseId}/quizzes`, {
    params: { per_page: 50 }
    });
    return data.filter(q => new Date(q.created_at) > sinceDate);
}
module.exports = { getNewAssignments, getNewQuizzes };