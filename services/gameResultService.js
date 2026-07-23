const gameService = require("./gameService");
const xpService = require("./xpService");


async function processWin(
    discordId,
    bet,
    multiplier
) {

    const result =
        await gameService.win(
            discordId,
            bet,
            multiplier
        );


    if (!result.success) {
        return result;
    }


    await xpService.addXP(
        discordId,
        Math.floor(bet / 10)
    );


    return {
        success: true,
        payout: result.payout
    };

}



async function processLoss(
    discordId,
    bet
) {


    await gameService.lose(
        discordId,
        bet
    );


    await xpService.addXP(
        discordId,
        Math.floor(bet / 20)
    );


    return {
        success:true
    };

}



module.exports = {
    processWin,
    processLoss
};
