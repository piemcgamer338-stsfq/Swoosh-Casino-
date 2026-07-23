const userService = require("../../services/userService");
const embed = require("../../utils/embed");
const format = require("../../utils/format");

module.exports = {
    name: "profile",
    aliases: ["prof", "me"],

    async execute(message) {

        const target =
            message.mentions.users.first() || message.author;

        const user = userService.getUser(target.id);

        return message.reply({
            embeds: [
                embed.createEmbed(
                    `${target.username}'s Profile`,
                    [
                        `💰 Balance: ${format.formatUSD(user.balance)}`,
                        `🏦 Vault: ${format.formatUSD(user.vault)}`,
                        ``,
                        `📊 Total Wagered: ${format.formatUSD(user.wagered)}`,
                        `🏆 Total Won: ${user.won}`,
                        `📉 Total Lost: ${user.lost}`,
                        ``,
                        `⭐ Level: ${user.level}`,
                        `✨ XP: ${user.xp}`
                    ].join("\n")
                )
            ]
        });

    }
};
