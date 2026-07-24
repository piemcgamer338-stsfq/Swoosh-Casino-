const db = require("../database/database");


async function setWinChannel(guildId, channelId) {

    const result = await db.query(
        `
        INSERT INTO settings
        (
            guild_id,
            win_channel
        )
        VALUES
        ($1,$2)

        ON CONFLICT (guild_id)
        DO UPDATE SET
        win_channel = $2

        RETURNING *
        `,
        [
            guildId,
            channelId
        ]
    );


    return result.rows[0];

}



async function getSettings(guildId) {


    const result = await db.query(
        `
        SELECT *
        FROM settings
        WHERE guild_id = $1
        `,
        [
            guildId
        ]
    );


    return result.rows[0];

}



module.exports = {

    setWinChannel,
    getSettings

};
