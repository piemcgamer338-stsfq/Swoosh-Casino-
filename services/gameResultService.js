const gameService = require("./gameService");
const xpService = require("./xpService");

function processWin(discordId, bet, multiplier) {

    const result = gameService.win(
        discordId,
        bet,
        multiplier
    );

    if (!result.success) {
        return result;
    }

    xpService.addXP(
        discordId,
        Math.floor(bet / 10)
    );

    return {
        success: true,
        payout: result.payout
    };
}


function processLoss(discordId, bet) {

    gameService.lose(
        discordId,
        bet
    );

    xpService.addXP(
        discordId,
        Math.floor(bet / 20)
    );

    return {
        success: true
    };
}


module.exports = {
    processWin,
    processLoss
};
