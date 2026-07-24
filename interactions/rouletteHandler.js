// interactions/rouletteHandler.js

const {
    EmbedBuilder
} = require("discord.js");

const {
    getRoulette,
    clearRoulette,
    spinRoulette,
    checkWin,
    payout
} = require("./rouletteHandler");

const User = require("../models/User");

module.exports.execute = async (interaction, betType) => {

    const game = getRoulette(interaction.user.id);

    if (!game)
        return interaction.reply({
            content: "❌ No roulette game running.",
            ephemeral: true
        });

    if (!game.bets.includes(betType))
        game.bets.push(betType);

    await interaction.update({
        embeds: [
            new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("🎰 Roulette")
                .setDescription(
                    `**Bet:** ${game.amount}\n\n` +
                    `Selected Bets:\n${game.bets.join(", ")}\n\n` +
                    `Press **START** when ready.`
                )
        ],
        components: interaction.message.components
    });

};

module.exports.start = async (interaction) => {

    const game = getRoulette(interaction.user.id);

    if (!game)
        return interaction.reply({
            content: "❌ No roulette game.",
            ephemeral: true
        });

    await interaction.deferUpdate();

    await new Promise(r => setTimeout(r, 5000));

    const number = spinRoulette();

    let winnings = 0;

    for (const bet of game.bets) {
        if (checkWin(number, bet))
            winnings += game.amount * payout(bet);
    }

    const user = await User.findOne({
        discordId: interaction.user.id
    });

    if (user)
        user.balance += winnings;

    if (user)
        await user.save();

    clearRoulette(interaction.user.id);

    const embed = new EmbedBuilder()
        .setColor(winnings ? "#00ff66" : "#ff0000")
        .setTitle("🎰 Roulette Result")
        .setDescription(
            `## **${number}**\n\n` +
            `Bet Per Selection: **${game.amount}**\n` +
            `Selections: **${game.bets.join(", ")}**\n\n` +
            (winnings
                ? `🎉 Won **${winnings}**`
                : `💀 Lost **${game.amount * game.bets.length}**`)
        );

    await interaction.editReply({
        embeds: [embed],
        components: []
    });

};
