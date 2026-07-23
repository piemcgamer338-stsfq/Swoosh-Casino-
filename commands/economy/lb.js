const db = require("../../database/database");
const embed = require("../../utils/embed");
const format = require("../../utils/format");

module.exports = {
    name: "lb",
    aliases: ["leaderboard", "top"],

    async execute(message) {

        const users = db.prepare(`
            SELECT discord_id, balance
            FROM users
            ORDER BY balance DESC
            LIMIT 10
        `).all();

        let description = "";

        for (let i = 0; i < users.length; i++) {

            let username = "Unknown";

            try {
                const user = await message.client.users.fetch(users[i].discord_id);
                username = user.username;
            } catch {}

            description += `**${i + 1}.** ${username} — ${format.formatUSD(users[i].balance)}\n`;
        }

        return message.reply({
            embeds: [
                embed.createEmbed(
                    "💰 Richest Players",
                    description || "Nobody yet."
                )
            ]
        });

    }
};
