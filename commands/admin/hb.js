const db = require("../../database/database");
const embed = require("../../utils/embed");
const config = require("../../config/config");

module.exports = {
    name: "hb",
    aliases: ["housebalance"],

    async execute(message) {

        if (message.author.id !== config.ownerId) return;

        const house = db.prepare(
            "SELECT balance FROM house WHERE id = 1"
        ).get();

        return message.reply({
            embeds: [
                embed.createEmbed(
                    "House Balance",
                    `🏦 **${house.balance.toLocaleString()} Points**`
                )
            ]
        });
    }
};
