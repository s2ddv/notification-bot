const axios = require('axios');

const api = axios.create({
    baseURL: process.env.CANVAS_URL,
    headers: { Authorization: `Bearer ${process.env.CANVAS_TOKEN}` }
});

async function getNewAssignments(courseId, sinceDate) {
    try {
        const { data } = await api.get(`/api/v1/courses/${courseId}/assignments`, {
            params: { order_by: 'created_at', per_page: 50 }
        });
        return data.filter(a => new Date(a.created_at) > sinceDate);
    } catch (error) {
        console.error(`Erro ao buscar assignments do curso ${courseId}:`, error.message);
        return [];
    }
}

async function getNewQuizzes(courseId, sinceDate) {
    try {
        const { data } = await api.get(`/api/v1/courses/${courseId}/quizzes`, {
            params: { per_page: 50 }
        });
        return data.filter(q => new Date(q.created_at) > sinceDate);
    } catch (error) {
        console.error(`Erro ao buscar quizzes do curso ${courseId}:`, error.message);
        return [];
    }
}

module.exports = { getNewAssignments, getNewQuizzes };