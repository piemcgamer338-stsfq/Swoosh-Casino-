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


        const reward = 2;


        await userService.updateBalance(
            message.author.id,
            reward
        );


        const updated =
            await userService.getUser(
                message.author.id
            );


        return message.reply({

            embeds:[

                {
                    title:"🎁 Daily Reward",

                    description:
                    [
                        `💰 Claimed: **${format.formatUSD(reward)}**`,
                        "",
                        `💳 Balance: **${format.formatUSD(updated.balance)}**`
                    ].join("\n"),

                    color:0x00ff00
                }

            ]

        });


    }

};
