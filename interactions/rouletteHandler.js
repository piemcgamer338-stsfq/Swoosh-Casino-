const { EmbedBuilder } = require("discord.js");

const balanceService = require("../services/balanceService");

const {
    addBet,
    getRoulette,
    clearRoulette,
    spinRoulette,
    checkWin,
    payout
} = require("../utils/rouletteHandler");

async function select(interaction, bet) {

    const game = getRoulette(interaction.user.id);

    if (!game) {
        return interaction.reply({
            content: "❌ No roulette game running.",
            ephemeral: true
        });
    }

    addBet(interaction.user.id, bet);

    return interaction.update({
        embeds: [
            new EmbedBuilder()
                .setColor("Red")
                .setTitle("🎰 Roulette")
                .setDescription(
`**Bet Per Selection:** ${game.amount}

**Selected Bets:**
${game.bets.join(", ")}

**Total Bet:** ${game.amount * game.bets.length}

Press **START** when ready.`
                )
        ],
        components: interaction.message.components
    });

}

async function start(interaction) {

    const game = getRoulette(interaction.user.id);

    if (!game) {
        return interaction.reply({
            content: "❌ No roulette game running.",
            ephemeral: true
        });
    }

    const totalBet = game.amount * game.bets.length;

    const hasMoney = await balanceService.hasBalance(
        interaction.user.id,
        totalBet
    );

    if (!hasMoney) {

        clearRoulette(interaction.user.id);

        return interaction.reply({
            content: "❌ You don't have enough balance.",
            ephemeral: true
        });

    }

    await balanceService.removeBalance(
        interaction.user.id,
        totalBet,
        "roulette_bet"
    );

    await interaction.deferUpdate();

    await new Promise(resolve => setTimeout(resolve, 5000));

    const number = spinRoulette();

    let winnings = 0;

    for (const bet of game.bets) {

        if (checkWin(number, bet)) {

            winnings += game.amount * payout(bet);

        }

    }

    if (winnings > 0) {

        await balanceService.addBalance(
            interaction.user.id,
            winnings,
            "roulette_win"
        );

    }

    clearRoulette(interaction.user.id);

    const embed = new EmbedBuilder()
        .setColor(winnings ? "Green" : "Red")
        .setTitle("🎰 Roulette Result")
        .setDescription(
`# 🎲 Number: **${number}**

**Bet Per Selection:** ${game.amount}
**Selections:** ${game.bets.join(", ")}
**Total Bet:** ${totalBet}

${winnings
? `✅ You won **${winnings}**`
: `❌ You lost **${totalBet}**`}`
        );

    return interaction.editReply({
        embeds: [embed],
        components: []
    });

}

module.exports = {
    select,
    start
};
