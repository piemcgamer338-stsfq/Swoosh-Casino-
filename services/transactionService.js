const db = require("../database/database");


async function addTransaction(
    discordId,
    type,
    amount
) {

    const result = await db.query(
        `
        INSERT INTO transactions
        (
            discord_id,
            type,
            amount
        )
        VALUES
        ($1,$2,$3)
        RETURNING *
        `,
        [
            discordId,
            type,
            amount
        ]
    );


    return result.rows[0];

}



async function getTransactions(discordId) {

    const result = await db.query(
        `
        SELECT *
        FROM transactions
        WHERE discord_id = $1
        ORDER BY created_at DESC
        `,
        [
            discordId
        ]
    );


    return result.rows;

}



module.exports = {
    addTransaction,
    getTransactions
};
