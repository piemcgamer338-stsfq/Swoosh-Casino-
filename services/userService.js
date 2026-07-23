const db = require("../database/database");


async function createUser(discordId) {

    const result = await db.query(
        `
        INSERT INTO users (discord_id)
        VALUES ($1)
        ON CONFLICT (discord_id)
        DO NOTHING
        RETURNING *
        `,
        [discordId]
    );


    if (result.rows.length > 0) {
        return result.rows[0];
    }


    return getUser(discordId);

}



async function getUser(discordId) {

    let result = await db.query(
        `
        SELECT *
        FROM users
        WHERE discord_id = $1
        `,
        [discordId]
    );


    if (result.rows.length === 0) {

        return createUser(discordId);

    }


    return result.rows[0];

}



async function updateBalance(discordId, amount) {

    await createUser(discordId);


    const result = await db.query(
        `
        UPDATE users
        SET balance = balance + $1
        WHERE discord_id = $2
        RETURNING *
        `,
        [
            amount,
            discordId
        ]
    );


    return result.rows[0];

}



async function updateUser(discordId, data) {

    const keys = Object.keys(data);

    const values = Object.values(data);


    const updates = keys.map(
        (key,index)=>`${key} = $${index+1}`
    );


    const result = await db.query(
        `
        UPDATE users
        SET ${updates.join(",")}
        WHERE discord_id = $${values.length+1}
        RETURNING *
        `,
        [
            ...values,
            discordId
        ]
    );


    return result.rows[0];

}



module.exports = {
    createUser,
    getUser,
    updateBalance,
    updateUser
};
