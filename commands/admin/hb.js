const db = require("../../database/database");
const embed = require("../../utils/embed");
const config = require("../../config/config");

module.exports = {
    name: "hb",
    aliases: ["housebalance"],

    async execute(message) {

        if (message.author.id !== config.ownerId) return;

        const result = await db.query(
            "SELECT balance FROM house WHERE id = 1"
        );

        const house = result.rows[0];

        return message.reply({
            embeds: [
                embed.createEmbed(
                    "House Balance",
                    `🏦 **${Number(house.balance).toLocaleString()} Points**`
                )
            ]
        });
    }
};
