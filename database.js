const Database = require('better-sqlite3');
const db = new Database('database.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS sent_items (
        type TEXT,
        item_id INTEGER,
        course_id INTEGER,
        sent_at TEXT,
        PRIMARY KEY (type, item_id)
    )
`);

function isAlreadySent(type, itemId) {
    const row = db.prepare('SELECT 1 FROM sent_items WHERE type = ? AND item_id = ?').get(type, itemId);
    return !!row;
}

function markAsSent(type, itemId, courseId) {
    db.prepare('INSERT OR IGNORE INTO sent_items (type, item_id, course_id, sent_at) VALUES (?, ?, ?, ?)')
      .run(type, itemId, courseId, new Date().toISOString());
}

module.exports = { isAlreadySent, markAsSent };