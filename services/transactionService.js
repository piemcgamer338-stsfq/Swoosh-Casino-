const db = require("../database/database");

function addTransaction(discordId, type, amount) {
    db.prepare(`
        INSERT INTO transactions (
            discord_id,
            type,
            amount
        )
        VALUES (?, ?, ?)
    `).run(discordId, type, amount);
}

function getTransactions(discordId, limit = 10) {
    return db.prepare(`
        SELECT *
        FROM transactions
        WHERE discord_id = ?
        ORDER BY id DESC
        LIMIT ?
    `).all(discordId, limit);
}

module.exports = {
    addTransaction,
    getTransactions
};
