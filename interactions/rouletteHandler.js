const { EmbedBuilder } = require("discord.js");

const User = require("../models/User");

const {
    addBet,
    getRoulette,
    clearRoulette,
    spinRoulette,
    checkWin,
    payout
} = require("../utils/rouletteHandler");

async function select(interaction, betType) {

    const game = getRoulette(interaction.user.id);

    if (!game) {
        return interaction.reply({
            content: "❌ No roulette game running.",
            ephemeral: true
        });
    }

    addBet(interaction.user.id, betType);

    await interaction.update({

        embeds: [

            new EmbedBuilder()
                .setColor("#c0392b")
                .setTitle("🎰 Roulette")
                .setDescription(
`# Place your bets

💰 Bet Per Selection
**${game.amount}**

Selected Bets:
${game.bets.length ? game.bets.join(", ") : "None"}

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

    await new Promise(resolve => setTimeout(resolve, 5000));

    const number = spinRoulette();

    let winnings = 0;

    for (const bet of game.bets) {

        if (checkWin(number, bet)) {
            winnings += game.amount * payout(bet);
        }

    }

    const user = await User.findOne({
        discordId: interaction.user.id
    });

    if (user) {
        user.balance += winnings;
        await user.save();
    }

    clearRoulette(interaction.user.id);

    const embed = new EmbedBuilder()
        .setColor(winnings > 0 ? "#2ecc71" : "#e74c3c")
        .setTitle("🎰 Roulette Result")
        .setDescription(
`# 🎲 ${number}

Bet Per Selection: **${game.amount}**

Selections:
${game.bets.join(", ")}

${winnings > 0
    ? `🎉 You won **${winnings}**`
    : `💀 You lost **${game.amount * game.bets.length}**`
}`
        );

    await interaction.editReply({

        embeds: [embed],

        components: []

    });

}

module.exports = {
    select,
    start
};
