const db = require("../database/database");
const houseService = require("./houseService");
const balanceService = require("./balanceService");
const userService = require("./userService");


async function shouldForceLose(discordId) {

    const user =
        await userService.getUser(discordId);

    return user.force_lose === 1;

}



async function canBet(discordId, amount) {

    const user =
        await userService.getUser(discordId);


    if (amount <= 0) {

        return {
            success: false,
            message: "Invalid bet amount."
        };

    }


    if (Number(user.balance) < Number(amount)) {

        return {
            success: false,
            message: "You don't have enough balance."
        };

    }


    return {
        success: true
    };

}



async function lose(discordId, bet) {


    await balanceService.removeBalance(
        discordId,
        bet,
        "game_loss"
    );


    await houseService.add(bet);


    await db.query(
        `
        UPDATE users
        SET
            wagered = wagered + $1,
            rateback_wagered = rateback_wagered + $1,
            lost = lost + 1
        WHERE discord_id = $2
        `,
        [
            bet,
            discordId
        ]
    );


}



async function win(
    discordId,
    bet,
    multiplier = 2
) {


    const payout =
        Math.floor(
            bet * multiplier
        );


    const canPay =
        await houseService.canPay(
            payout
        );


    if (!canPay) {

        return {
            success:false,
            message:"House cannot pay this bet."
        };

    }



    await balanceService.addBalance(
        discordId,
        payout,
        "game_win"
    );


    await houseService.remove(
        payout
    );


    await db.query(
        `
        UPDATE users
        SET
            wagered = wagered + $1,
            rateback_wagered = rateback_wagered + $1,
            won = won + 1
        WHERE discord_id = $2
        `,
        [
            bet,
            discordId
        ]
    );


    return {
        success:true,
        payout
    };

}



module.exports = {
    shouldForceLose,
    canBet,
    lose,
    win
};
