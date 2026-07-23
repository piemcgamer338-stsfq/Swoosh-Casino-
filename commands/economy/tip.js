const balanceService = require("../../services/balanceService");
const betService = require("../../services/betService");
const embed = require("../../utils/embed");

module.exports = {
    name: "tip",
    aliases: ["send"],

    async execute(message, args) {

        const target = message.mentions.users.first();

        if (!target) {
            return message.reply({
                embeds: [
                    embed.error("Mention a user to tip.")
                ]
            });
        }

        if (target.id === message.author.id) {
            return message.reply({
                embeds: [
                    embed.error("You can't tip yourself.")
                ]
            });
        }

        const amount = Number(args[1]);

        const bet = betService.validateBet(
            message.author.id,
            amount
        );

        if (!bet.success) {
            return message.reply({
                embeds: [
                    embed.error(bet.message)
                ]
            });
        }

        balanceService.removeBalance(
            message.author.id,
            amount,
            "tip_sent"
        );

        balanceService.addBalance(
            target.id,
            amount,
            "tip_received"
        );

        return message.reply({
            embeds: [
                embed.success(
                    `You tipped **${amount.toLocaleString()} Points** to ${target}.`
                )
            ]
        });
    }
};
