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
`Bet Per Selection: **${game.amount}**

Selected Bets:
${game.bets.join(", ")}

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

    await interaction.deferUpdate();

    await new Promise(r => setTimeout(r, 5000));

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
`# ${number}

Bet Per Selection: **${game.amount}**

Selections:
${game.bets.join(", ")}

${winnings
? `✅ Won **${winnings}**`
: `❌ Lost **${game.amount * game.bets.length}**`}`
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
