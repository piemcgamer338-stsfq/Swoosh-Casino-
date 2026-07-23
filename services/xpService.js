const db = require("../database/database");

function addXP(discordId, amount) {

    db.prepare(`
        UPDATE users
        SET xp = xp + ?
        WHERE discord_id = ?
    `).run(amount, discordId);

    let user = db.prepare(
        "SELECT xp, level FROM users WHERE discord_id = ?"
    ).get(discordId);

    while (user.xp >= user.level * 100) {

        user.xp -= user.level * 100;
        user.level++;

    }

    db.prepare(`
        UPDATE users
        SET
            xp = ?,
            level = ?
        WHERE discord_id = ?
    `).run(user.xp, user.level, discordId);

    return user;
}

module.exports = {
    addXP
};
