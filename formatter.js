function formatAssignment(a) {
    const due = a.due_at ? new Date(a.due_at).toLocaleString('pt-BR') : 'Sem prazo definido';
    return `📚 *Nova Atividade!*\n\n*${a.name}*\n📅 Entrega: ${due}\n🔗 ${a.html_url}`;
}

function formatQuiz(q) {
    const due = q.due_at ? new Date(q.due_at).toLocaleString('pt-BR') : 'Sem prazo definido';
    return `📝 *Novo Quiz!*\n\n*${q.title}*\n📅 Entrega: ${due}\n🔗 ${q.html_url}`;
}

module.exports = { formatAssignment, formatQuiz };