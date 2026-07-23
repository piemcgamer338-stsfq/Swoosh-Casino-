const embed = require("../../utils/embed");
const format = require("../../utils/format");

module.exports = {
    name: "price",
    aliases: ["p"],

    async execute(message, args) {

        const points = Number(args[0]);

        if (isNaN(points) || points <= 0) {
            return message.reply({
                embeds: [
                    embed.error("Usage: `.price <points>`")
                ]
            });
        }

        return message.reply({
            embeds: [
                embed.createEmbed(
                    "Point Value",
                    [
                        `💰 **Points:** ${format.formatPoints(points)}`,
                        `💵 **Value:** ${format.formatUSD(points)}`
                    ].join("\n")
                )
            ]
        });
    }
};
