const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require("../../config/config");

module.exports = {
    name: "help",
    aliases: ["h"],

    async execute(message) {
        const menu = new StringSelectMenuBuilder()
            .setCustomId("help-menu")
            .setPlaceholder("Select a category")
            .addOptions([
                {
                    label: "Economy",
                    value: "economy",
                    description: "Balance, Daily, Tip, Vault"
                },
                {
                    label: "Games",
                    value: "games",
                    description: "Casino Games"
                },
                {
                    label: "Wallet",
                    value: "wallet",
                    description: "Deposit & Withdraw"
                },
                {
                    label: "Leaderboard",
                    value: "leaderboard",
                    description: "Top Players"
                },
                {
                    label: "General",
                    value: "general",
                    description: "Bot Commands"
                }
            ]);

        const row = new ActionRowBuilder().addComponents(menu);

        await message.reply({
            embeds: [
                {
                    color: 0xC0C0C0,
                    title: `${config.bot.name} Help`,
                    description: `Prefix: \`${config.bot.prefix}\`\n\nSelect a category below.`,
                    footer: {
                        text: config.bot.name
                    }
                }
            ],
            components: [row]
        });
    }
};
