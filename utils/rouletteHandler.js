const activeRoulette = new Map();

function startRoulette(userId, amount) {
    activeRoulette.set(userId, {
        amount,
        bets: []
    });
}

function addBet(userId, bet) {
    const game = activeRoulette.get(userId);

    if (!game) return false;

    if (!game.bets.includes(bet)) {
        game.bets.push(bet);
    }

    return true;
}

function getRoulette(userId) {
    return activeRoulette.get(userId);
}

function clearRoulette(userId) {
    activeRoulette.delete(userId);
}

function spinRoulette() {
    return Math.floor(Math.random() * 37);
}

function checkWin(number, bet) {

    if (bet === "col1")
        return number !== 0 && number % 3 === 1;

    if (bet === "col2")
        return number !== 0 && number % 3 === 2;

    if (bet === "col3")
        return number !== 0 && number % 3 === 0;

    const redNumbers = [
        1,3,5,7,9,12,14,16,
        18,19,21,23,25,27,
        30,32,34,36
    ];

    if (bet === "red")
        return redNumbers.includes(number);

    if (bet === "black")
        return number !== 0 && !redNumbers.includes(number);

    if (bet === "odd")
        return number !== 0 && number % 2 === 1;

    if (bet === "even")
        return number !== 0 && number % 2 === 0;

    if (bet === "low")
        return number >= 1 && number <= 16;

    if (bet === "high")
        return number >= 17 && number <= 36;

    return false;
}

function payout(bet) {

    if (
        bet === "col1" ||
        bet === "col2" ||
        bet === "col3"
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
