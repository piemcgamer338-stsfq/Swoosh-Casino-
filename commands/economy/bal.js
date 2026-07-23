const userService = require("../../services/userService");
const embed = require("../../utils/embed");

module.exports = {
    name: "bal",
    aliases: ["balance", "b"],

    async execute(message) {
        const target =
            message.mentions.users.first() || message.author;

        const user = userService.getUser(target.id);

        return message.reply({
            embeds: [
                embed.createEmbed(
                    `${target.username}'s Balance`,
                    [
                        `💰 **Balance:** ${user.balance.toLocaleString()} Points`,
                        `🏦 **Vault:** ${user.vault.toLocaleString()} Points`,
                        ``,
                        `📊 **Wagered:** ${user.wagered.toLocaleString()}`,
                        `🏆 **Won:** ${user.won.toLocaleString()}`,
                        `📉 **Lost:** ${user.lost.toLocaleString()}`,
                        ``,
                        `⭐ **Level:** ${user.level}`,
                        `✨ **XP:** ${user.xp}`
                    ].join("\n")
                )
            ]
        });
    }
};
