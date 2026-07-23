const userService = require("./userService");
const transactionService = require("./transactionService");


async function hasBalance(discordId, amount) {

    const user = await userService.getUser(discordId);

    return Number(user.balance) >= Number(amount);

}



async function addBalance(
    discordId,
    amount,
    type = "credit"
) {

    const user =
        await userService.updateBalance(
            discordId,
            amount
        );


    await transactionService.addTransaction(
        discordId,
        type,
        amount
    );


    return user;

}



async function removeBalance(
    discordId,
    amount,
    type = "debit"
) {

    const user =
        await userService.getUser(discordId);


    if (
        Number(user.balance) < Number(amount)
    ) {
        return null;
    }


    await userService.updateBalance(
        discordId,
        -amount
    );


    await transactionService.addTransaction(
        discordId,
        type,
        -amount
    );


    return await userService.getUser(discordId);

}



module.exports = {
    hasBalance,
    addBalance,
    removeBalance
};
