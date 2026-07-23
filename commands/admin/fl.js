const db = require("../../database/database");
const embed = require("../../utils/embed");
const config = require("../../config/config");
const userService = require("../../services/userService");

module.exports = {
    name: "fl",
    aliases: ["forcelose"],

    async execute(message) {

        if (message.author.id !== config.ownerId) return;

        const target = message.mentions.users.first();

        if (!target) {
            return message.reply({
                embeds: [
                    embed.error("Mention a user.")
                ]
            });
        }

        userService.getUser(target.id);

        const user = db.prepare(
            "SELECT force_lose FROM users WHERE discord_id = ?"
        ).get(target.id);

        const newValue = user.force_lose ? 0 : 1;

        db.prepare(
            "UPDATE users SET force_lose = ? WHERE discord_id = ?"
        ).run(newValue, target.id);

        return message.reply({
            embeds: [
                embed.success(
                    newValue
                        ? `${target.username} will now **always lose**.`
                        : `${target.username} will now play **normally**.`
                )
            ]
        });
    }
};
