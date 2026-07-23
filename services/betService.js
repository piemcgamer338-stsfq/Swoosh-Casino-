const balanceService = require("./balanceService");
const userService = require("./userService");

function validateBet(discordId, amount) {
    if (isNaN(amount)) {
        return {
            success: false,
            message: "❌ Bet must be a number."
        };
    }

    amount = Math.floor(Number(amount));

    if (amount <= 0) {
        return {
            success: false,
            message: "❌ Bet must be greater than 0."
        };
    }

    const user = userService.getUser(discordId);

    if (user.balance < amount) {
        return {
            success: false,
            message: "❌ You don't have enough balance."
        };
    }

    return {
        success: true,
        amount
    };
}

function loseBet(discordId, amount) {
    balanceService.removeBalance(discordId, amount, "bet_loss");

    return userService.getUser(discordId);
}

function winBet(discordId, betAmount, multiplier = 2) {
    const profit = Math.floor(betAmount * multiplier);

    balanceService.addBalance(discordId, profit, "bet_win");

    return userService.getUser(discordId);
}

module.exports = {
    validateBet,
    loseBet,
    winBet
};
