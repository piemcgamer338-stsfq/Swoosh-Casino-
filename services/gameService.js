const db = require("../database/database");
const houseService = require("./houseService");
const balanceService = require("./balanceService");
const userService = require("./userService");

function shouldForceLose(discordId) {
    const user = userService.getUser(discordId);
    return user.force_lose === 1;
}

function canBet(discordId, amount) {
    const user = userService.getUser(discordId);

    if (amount <= 0) {
        return {
            success: false,
            message: "Invalid bet amount."
        };
    }

    if (user.balance < amount) {
        return {
            success: false,
            message: "You don't have enough balance."
        };
    }

    return {
        success: true
    };
}

function lose(discordId, bet) {

    balanceService.removeBalance(
        discordId,
        bet,
        "game_loss"
    );

    houseService.add(bet);

    db.prepare(`
        UPDATE users
        SET
            wagered = wagered + ?,
            lost = lost + 1
        WHERE discord_id = ?
    `).run(bet, discordId);

}

function win(discordId, bet, multiplier = 2) {

    const payout = Math.floor(bet * multiplier);

    if (!houseService.canPay(payout)) {
        return {
            success: false,
            message: "House cannot pay this bet."
        };
    }

    balanceService.addBalance(
        discordId,
        payout,
        "game_win"
    );

    houseService.remove(payout);

    db.prepare(`
        UPDATE users
        SET
            wagered = wagered + ?,
            won = won + 1
        WHERE discord_id = ?
    `).run(bet, discordId);

    return {
        success: true,
        payout
    };
}

module.exports = {
    shouldForceLose,
    canBet,
    lose,
    win
};
