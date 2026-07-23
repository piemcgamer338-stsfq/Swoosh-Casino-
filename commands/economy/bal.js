const { AttachmentBuilder } = require("discord.js");
const userService = require("../../services/userService");
const generateBalanceCard = require("../../utils/generateBalanceCard");

module.exports = {

    name: "bal",
    aliases: ["balance", "b"],

    async execute(message) {

        const target =
            message.mentions.users.first() ||
            message.author;

        const user =
            await userService.getUser(target.id);

        if (!user) {
            return message.reply("❌ User not found.");
        }

        const image =
            await generateBalanceCard(
                target,
                user
            );

        const attachment =
            new AttachmentBuilder(
                image,
                {
                    name: "balance.png"
                }
            );

        return message.reply({
            files: [attachment]
        });

    }

};
