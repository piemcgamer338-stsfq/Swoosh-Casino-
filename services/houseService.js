const db = require("../database/database");

function getHouse() {
    return db.prepare(
        "SELECT * FROM house WHERE id = 1"
    ).get();
}

function add(amount) {
    db.prepare(
        "UPDATE house SET balance = balance + ? WHERE id = 1"
    ).run(amount);
}

function remove(amount) {
    db.prepare(
        "UPDATE house SET balance = balance - ? WHERE id = 1"
    ).run(amount);
}

function canPay(amount) {
    const house = getHouse();
    return house.balance >= amount;
}

module.exports = {
    getHouse,
    add,
    remove,
    canPay
};
