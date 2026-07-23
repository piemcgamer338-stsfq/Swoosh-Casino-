const db = require("../database/database");

async function addXP(discordId, amount) {
    // Get current XP + level
    const result = await db.query(
        "SELECT xp, level FROM users WHERE discord_id = $1",
        [discordId]
    );

    if (result.rows.length === 0) return null;

    let user = result.rows[0];

    let xp = Number(user.xp) + Number(amount);
    let level = Number(user.level);

    while (xp >= level * 100) {
        xp -= level * 100;
        level++;
    }

    await db.query(
        `
        UPDATE users
        SET xp = $1,
            level = $2
        WHERE discord_id = $3
        `,
        [xp, level, discordId]
    );

    return {
        xp,
        level
    };
}

module.exports = {
    addXP
};
