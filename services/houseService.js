const db = require("../database/database");


async function getHouse() {

    const result = await db.query(
        `
        SELECT *
        FROM house
        WHERE id = 1
        `
    );


    return result.rows[0];

}



async function add(amount) {

    const result = await db.query(
        `
        UPDATE house
        SET balance = balance + $1
        WHERE id = 1
        RETURNING *
        `,
        [
            amount
        ]
    );


    return result.rows[0];

}



async function remove(amount) {

    const result = await db.query(
        `
        UPDATE house
        SET balance = balance - $1
        WHERE id = 1
        RETURNING *
        `,
        [
            amount
        ]
    );


    return result.rows[0];

}



async function canPay(amount) {

    const house = await getHouse();


    if (!house) {
        return false;
    }


    return Number(house.balance) >= Number(amount);

}



module.exports = {
    getHouse,
    add,
    remove,
    canPay
};
