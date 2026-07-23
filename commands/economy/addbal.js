const balanceService = require("../../services/balanceService");
const embed = require("../../utils/embed");
const config = require("../../config/config");

module.exports = {
    name: "addbal",
    aliases: ["ab"],

    async execute(message, args) {

        if (message.author.id !== config.ownerId) {
            return;
        }

        const target = message.mentions.users.first();

        if (!target) {
            return message.reply({
                embeds: [
                    embed.error("Mention a user.")
                ]
            });
        }

        const amount = Number(args[1]);

        if (isNaN(amount) || amount <= 0) {
            return message.reply({
                embeds: [
                    embed.error("Invalid amount.")
                ]
            });
        }

        balanceService.addBalance(
            target.id,
            amount,
            "owner_addbal"
        );

        return message.reply({
            embeds: [
                embed.success(
                    `Added **${amount.toLocaleString()} Points** to ${target}.`
                )
            ]
        });
    }
};
