const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ComponentType
} = require("discord.js");

const gameService = require("../../services/gameService");
const gameResultService = require("../../services/gameResultService");
const format = require("../../utils/format");
const userService = require("../../services/userService");

module.exports = {
    name: "coinflip",
    aliases: ["cf"],

    async execute(message, args) {

        const bet = Number(args[0]);

        if (!bet || bet <= 0) {
            return message.reply("❌ Usage: `.cf <amount>`");
        }


        const check = gameService.canBet(
            message.author.id,
            bet
        );

        if (!check.success) {
            return message.reply(`❌ ${check.message}`);
        }


        const user = userService.getUser(
            message.author.id
        );


        const embed = new EmbedBuilder()
            .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTitle("🪙 Coin Flip")
            .setDescription(
                [
                    `💰 Bet: **${format.formatUSD(bet)}**`,
                    ``,
                    `Choose your side:`
                ].join("\n")
            )
            .setColor("Gold");


        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("heads")
                    .setLabel("🟡 Heads")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("tails")
                    .setLabel("⚪ Tails")
                    .setStyle(ButtonStyle.Secondary)
            );


        const msg = await message.reply({
            embeds: [embed],
            components: [buttons]
        });


        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000
        });


        collector.on("collect", async interaction => {

            if (interaction.user.id !== message.author.id) {
                return interaction.reply({
                    content: "❌ This is not your game.",
                    ephemeral: true
                });
            }


            await interaction.deferUpdate();


            const choice = interaction.customId;


            await msg.edit({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: message.author.username,
                            iconURL: message.author.displayAvatarURL()
                        })
                        .setTitle("🪙 Coin Flip")
                        .setDescription(
                            "🔄 Coin is flipping..."
                        )
                        .setColor("Yellow")
                ],
                components: []
            });


            setTimeout(async () => {


                const result =
                    Math.random() < 0.5
                        ? "heads"
                        : "tails";


                const won =
                    choice === result;


                let resultText;


                if (won) {

                    const win =
                        gameResultService.processWin(
                            message.author.id,
                            bet,
                            2
                        );

                    resultText =
                        `🎉 You Won!\n💰 Profit: **${format.formatUSD(win.payout - bet)}**`;

                } else {

                    gameResultService.processLoss(
                        message.author.id,
                        bet
                    );

                    resultText =
                        `❌ You Lost!\n💸 Lost: **${format.formatUSD(bet)}**`;

                }


                const updated =
                    userService.getUser(
                        message.author.id
                    );


                await msg.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: message.author.username,
                                iconURL: message.author.displayAvatarURL()
                            })
                            .setTitle("🪙 Coin Flip Result")
                            .setDescription(
                                [
                                    `🪙 Landed on: **${result.toUpperCase()}**`,
                                    ``,
                                    resultText,
                                    ``,
                                    `💳 Balance: **${format.formatUSD(updated.balance)}**`
                                ].join("\n")
                            )
                            .setColor(
                                won ? "Green" : "Red"
                            )
                    ],
                    components: []
                });


                collector.stop();


            }, 3000);

        });


        collector.on("end", async () => {

            try {

                await msg.edit({
                    components: []
                });

            } catch {}

        });

    }
};
