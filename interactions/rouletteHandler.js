const fs = require("fs");
const path = require("path");

const activeRoulette = new Map();

function startRoulette(userId, amount) {
    activeRoulette.set(userId, {
        amount,
        bets: []
    });
}

function addBet(userId, type) {
    const game = activeRoulette.get(userId);

    if (!game) return false;

    game.bets.push(type);
    return true;
}

function getRoulette(userId) {
    return activeRoulette.get(userId);
}

function clearRoulette(userId) {
    activeRoulette.delete(userId);
}

function spinRoulette() {

    // 0-36 roulette number
    return Math.floor(Math.random() * 37);

}

function checkWin(number, bet) {

    // column
    if (bet === "col1") {
        return number !== 0 && number % 3 === 1;
    }

    if (bet === "col2") {
        return number !== 0 && number % 3 === 2;
    }

    if (bet === "col3") {
        return number !== 0 && number % 3 === 0;
    }


    // colors
    const redNumbers = [
        1,3,5,7,9,12,14,16,
        18,19,21,23,25,27,
        30,32,34,36
    ];

    if (bet === "red") {
        return redNumbers.includes(number);
    }

    if (bet === "black") {
        return number !== 0 && !redNumbers.includes(number);
    }


    // odd even
    if (bet === "odd") {
        return number !== 0 && number % 2 === 1;
    }

    if (bet === "even") {
        return number !== 0 && number % 2 === 0;
    }


    // ranges

    if (bet === "low") {
        return number >= 1 && number <= 16;
    }

    if (bet === "high") {
        return number >= 17 && number <= 36;
    }


    return false;
}


function payout(type) {

    if (
        type === "col1" ||
        type === "col2" ||
        type === "col3"
    ) {
        return 3;
    }


    return 2;
}


module.exports = {
    startRoulette,
    addBet,
    getRoulette,
    clearRoulette,
    spinRoulette,
    checkWin,
    payout
};
