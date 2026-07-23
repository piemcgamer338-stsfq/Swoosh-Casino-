const balanceService = require("../../services/balanceService");
const embed = require("../../utils/embed");
const config = require("../../config/config");
const userService = require("../../services/userService");
const db = require("../../database/database");

db.exec(`
CREATE TABLE IF NOT EXISTS daily_claims (
    discord_id TEXT PRIMARY KEY,
    last_claim INTEGER NOT NULL
);
`);

const DAY = 24 * 60 * 60 * 1000;

module.exports = {
    name: "daily",
    aliases: ["claim"],

    async execute(message) {
        const userId = message.author.id;

        userService.getUser(userId);

        const data = db.prepare(
            "SELECT * FROM daily_claims WHERE discord_id = ?"
        ).get(userId);

        const now = Date.now();

        if (data) {
            const remaining = DAY - (now - data.last_claim);

            if (remaining > 0) {
                const hours = Math.floor(remaining / 3600000);
                const minutes = Math.floor((remaining % 3600000) / 60000);

                return message.reply({
                    embeds: [
                        embed.error(
                            `You already claimed your daily reward.\n\nTry again in **${hours}h ${minutes}m**.`
                        )
                    ]
                });
            }

            db.prepare(
                "UPDATE daily_claims SET last_claim = ? WHERE discord_id = ?"
            ).run(now, userId);

        } else {
            db.prepare(
                "INSERT INTO daily_claims (discord_id, last_claim) VALUES (?, ?)"
            ).run(userId, now);
        }

        balanceService.addBalance(
            userId,
            config.economy.dailyReward,
            "daily"
        );

        return message.reply({
            embeds: [
                embed.success(
                    `You claimed **${config.economy.dailyReward.toLocaleString()} Points**!`
                )
            ]
        });
    }
};
