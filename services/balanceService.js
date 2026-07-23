const userService = require("./userService");
const transactionService = require("./transactionService");

function hasBalance(discordId, amount) {
    const user = userService.getUser(discordId);
    return user.balance >= amount;
}

function addBalance(discordId, amount, type = "credit") {
    const user = userService.updateBalance(discordId, amount);

    transactionService.addTransaction(
        discordId,
        type,
        amount
    );

    return user;
}

function removeBalance(discordId, amount, type = "debit") {
    const user = userService.getUser(discordId);

    if (user.balance < amount) {
        return null;
    }

    userService.updateBalance(discordId, -amount);

    transactionService.addTransaction(
        discordId,
        type,
        -amount
    );

    return userService.getUser(discordId);
}

module.exports = {
    hasBalance,
    addBalance,
    removeBalance
};
