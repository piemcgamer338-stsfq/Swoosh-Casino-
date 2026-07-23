const db = require("../database/database");

async function addXP(discordId, amount) {

    await db.query(
        `
        UPDATE users
        SET xp = xp + $1
        WHERE discord_id = $2
        `,
        [
            amount,
            discordId
        ]
    );

    let result = await db.query(
        `
        SELECT xp, level
        FROM users
        WHERE discord_id = $1
        `,
        [discordId]
    );

    let user = result.rows[0];

    if (!user) return null;

    user.xp = Number(user.xp);
    user.level = Number(user.level);

    while (user.xp >= user.level * 100) {
        user.xp -= user.level * 100;
        user.level++;
    }

    await db.query(
        `
        UPDATE users
        SET
            xp = $1,
            level = $2
        WHERE discord_id = $3
        `,
        [
            user.xp,
            user.level,
            discordId
        ]
    );

    return user;
}

module.exports = {
    addXP
};
