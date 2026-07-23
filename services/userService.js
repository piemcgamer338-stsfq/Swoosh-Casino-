const db = require("../database/database");

function getUser(discordId) {
    let user = db
        .prepare("SELECT * FROM users WHERE discord_id = ?")
        .get(discordId);

    if (!user) {
        db.prepare(`
            INSERT INTO users (
                discord_id,
                balance,
                vault,
                wagered,
                won,
                lost,
                xp,
                level,
                force_lose
            )
            VALUES (?, 0, 0, 0, 0, 0, 0, 1, 0)
        `).run(discordId);

        user = db
            .prepare("SELECT * FROM users WHERE discord_id = ?")
            .get(discordId);
    }

    return user;
}

function updateBalance(discordId, amount) {
    getUser(discordId);

    db.prepare(`
        UPDATE users
        SET balance = balance + ?
        WHERE discord_id = ?
    `).run(amount, discordId);

    return getUser(discordId);
}

function setBalance(discordId, amount) {
    getUser(discordId);

    db.prepare(`
        UPDATE users
        SET balance = ?
        WHERE discord_id = ?
    `).run(amount, discordId);

    return getUser(discordId);
}

function updateVault(discordId, amount) {
    getUser(discordId);

    db.prepare(`
        UPDATE users
        SET vault = vault + ?
        WHERE discord_id = ?
    `).run(amount, discordId);

    return getUser(discordId);
}

module.exports = {
    getUser,
    updateBalance,
    setBalance,
    updateVault
};
