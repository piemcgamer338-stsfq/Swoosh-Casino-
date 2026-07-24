const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");

const balanceService = require("../../services/balanceService");
const { startRoulette } = require("../../utils/rouletteHandler");

module.exports = {

    name: "roulette",
    aliases: ["r"],

    async execute(message, args) {

        const bet = Number(args[0]);

        if (!bet || bet <= 0) {
            return message.reply("❌ Usage: `.roulette <amount>`");
        }

        const hasBalance = await balanceService.hasBalance(
            message.author.id,
            bet
        );

        if (!hasBalance) {
            return message.reply("❌ You don't have enough balance.");
        }

        // Start roulette session
        startRoulette(message.author.id, bet);

        const image = new AttachmentBuilder(
            "./assets/roulette.png",
            {
                name: "roulette.png"
            }
        );

        const embed = new EmbedBuilder()
            .setColor("#c0392b")
            .setTitle("🎰 Roulette")
            .setDescription(
`# Place your bets

💰 **Bet Per Selection**
${bet} Points

Each selected button costs **${bet}** Points.

Choose as many bets as you want,
then press **START**.`
            )
            .setImage("attachment://roulette.png")
            .setFooter({
                text: "Roulette"
            });

        const row1 = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("roulette_col1")
                    .setLabel("Column 1")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("roulette_col2")
                    .setLabel("Column 2")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("roulette_col3")
                    .setLabel("Column 3")
                    .setStyle(ButtonStyle.Danger)
            );

        const row2 = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("roulette_red")
                    .setLabel("Red")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("roulette_black")
                    .setLabel("Black")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("roulette_odd")
                    .setLabel("Odd")
                    .setStyle(ButtonStyle.Primary)
            );

        const row3 = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("roulette_even")
                    .setLabel("Even")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("roulette_low")
                    .setLabel("1 - 16")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("roulette_high")
                    .setLabel("17 - 36")
                    .setStyle(ButtonStyle.Success)
            );

        const row4 = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("roulette_start")
                    .setLabel("🎰 START")
                    .setStyle(ButtonStyle.Success)
            );

        await message.reply({

            embeds: [embed],

            files: [image],

            components: [
                row1,
                row2,
                row3,
                row4
            ]

        });

    }

};
