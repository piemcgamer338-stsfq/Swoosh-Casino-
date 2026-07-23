const balanceService = require("../../services/balanceService");
const embed = require("../../utils/embed");
const config = require("../../config/config");

const cooldown = new Map();

module.exports = {
    name: "daily",
    aliases: ["claim"],

    async execute(message) {
        const userId = message.author.id;

        if (cooldown.has(userId)) {
            return message.reply({
                embeds: [
                    embed.error("You have already claimed your daily reward.")
                ]
            });
        }

        balanceService.addBalance(
            userId,
            config.economy.dailyReward,
            "daily"
        );

        cooldown.set(userId, true);

        return message.reply({
            embeds: [
                embed.success(
                    `You claimed **${config.economy.dailyReward.toLocaleString()} Points**!`
                )
            ]
        });
    }
};
