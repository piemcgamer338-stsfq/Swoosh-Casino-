const db = require("../../database/database");
const embed = require("../../utils/embed");
const config = require("../../config/config");

module.exports = {
    name: "resetdaily",

    async execute(message, args) {

        if (message.author.id !== config.ownerId) return;

        const target = message.mentions.users.first();

        if (!target) {
            return message.reply({
                embeds: [
                    embed.error("Mention a user.")
                ]
            });
        }

        db.prepare(
            "DELETE FROM daily_claims WHERE discord_id = ?"
        ).run(target.id);

        return message.reply({
            embeds: [
                embed.success(
                    `${target.username}'s daily cooldown has been reset.`
                )
            ]
        });

    }
};
