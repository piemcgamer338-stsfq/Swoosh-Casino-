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

        await userService.getUser(target.id);

        const result = await db.query(
            "SELECT force_lose FROM users WHERE discord_id = $1",
            [target.id]
        );

        const user = result.rows[0];

        const newValue = user.force_lose ? 0 : 1;

        await db.query(
            "UPDATE users SET force_lose = $1 WHERE discord_id = $2",
            [newValue, target.id]
        );

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
