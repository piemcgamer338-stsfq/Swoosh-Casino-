const userService = require("../../services/userService");
const format = require("../../utils/format");

module.exports = {

    name: "daily",
    aliases: ["d"],

    async execute(message) {

        const user =
            await userService.getUser(
                message.author.id
            );

        const reward = 2; // 2 points

        const cooldown = 24 * 60 * 60 * 1000; // 24 hours

        const now = Date.now();

        const lastDaily = Number(user.last_daily || 0);

        if (now - lastDaily < cooldown) {

            const remaining = cooldown - (now - lastDaily);

            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);

            return message.reply({
                embeds: [
                    {
                        title: "⏳ Daily Cooldown",
                        description:
                            `You already claimed your daily reward.\n\n` +
                            `Try again in **${hours}h ${minutes}m**.`,
                        color: 0xffcc00
                    }
                ]
            });

        }

        await userService.updateBalance(
            message.author.id,
            reward
        );

        await userService.updateUser(
            message.author.id,
            {
                last_daily: now
            }
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
                        `💰 Claimed: **${reward} Points (${format.formatUSD(reward)})**`,
                        "",
                        `💳 Balance: **${updated.balance.toLocaleString()} Points (${format.formatUSD(updated.balance)})**`
                    ].join("\n"),

                    color: 0x00ff00
                }

            ]

        });

    }

};
