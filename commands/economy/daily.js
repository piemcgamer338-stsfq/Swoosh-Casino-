const userService = require("../../services/userService");
const format = require("../../utils/format");

// In-memory cooldowns (reset if bot restarts)
const dailyCooldown = new Map();

module.exports = {

    name: "daily",
    aliases: ["d"],

    async execute(message) {

        const reward = 2; // 2 Points

        const cooldown = 24 * 60 * 60 * 1000; // 24 Hours

        const now = Date.now();

        const lastClaim =
            dailyCooldown.get(message.author.id) || 0;

        if (now - lastClaim < cooldown) {

            const remaining =
                cooldown - (now - lastClaim);

            const hours =
                Math.floor(remaining / 3600000);

            const minutes =
                Math.floor((remaining % 3600000) / 60000);

            return message.reply({

                embeds: [
                    {
                        title: "⏳ Daily Cooldown",

                        description:
                        `You already claimed your daily reward.\n\n` +
                        `Come back in **${hours}h ${minutes}m**.`,

                        color: 0xffcc00
                    }
                ]

            });

        }

        dailyCooldown.set(
            message.author.id,
            now
        );

        await userService.updateBalance(
            message.author.id,
            reward
        );

        const updated =
            await userService.getUser(
                message.author.id
            );

        return message.reply({

            embeds: [
                {
                    title: "🎁 Daily Reward",

                    description: [
                        `💰 Claimed: **${reward.toLocaleString()} Points (${format.formatUSD(reward)})**`,
                        "",
                        `💳 Balance: **${updated.balance.toLocaleString()} Points (${format.formatUSD(updated.balance)})**`
                    ].join("\n"),

                    color: 0x00ff00
                }
            ]

        });

    }

};
