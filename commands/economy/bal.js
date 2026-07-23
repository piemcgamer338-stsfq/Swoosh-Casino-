const userService = require("../../services/userService");
const embed = require("../../utils/embed");

module.exports = {
    name: "bal",
    aliases: ["balance", "b"],

    async execute(message) {

        const target =
            message.mentions.users.first() || message.author;

        const user =
            await userService.getUser(target.id);

        if (!user) {
            return message.reply("❌ User not found.");
        }

        return message.reply({
            embeds: [
                embed.createEmbed(
                    `${target.username}'s Balance`,
                    [
                        `💰 **Balance:** ${(Number(user.balance) || 0).toLocaleString()} Points`,
                        `🏦 **Vault:** ${(Number(user.vault) || 0).toLocaleString()} Points`,
                        ``,
                        `📊 **Wagered:** ${(Number(user.wagered) || 0).toLocaleString()}`,
                        `🏆 **Won:** ${(Number(user.won) || 0).toLocaleString()}`,
                        `📉 **Lost:** ${(Number(user.lost) || 0).toLocaleString()}`,
                        ``,
                        `⭐ **Level:** ${Number(user.level) || 1}`,
                        `✨ **XP:** ${Number(user.xp) || 0}`
                    ].join("\n")
                )
            ]
        });
    }
};
