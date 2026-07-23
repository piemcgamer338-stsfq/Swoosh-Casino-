const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const houseService = require("../../services/houseService");
const balanceService = require("../../services/balanceService");
const format = require("../../utils/format");


const activeRains = new Map();



function parseTime(time) {

    const match = time.match(/^(\d+)(s|m|h)$/i);

    if (!match) return null;


    const amount = Number(match[1]);

    const type = match[2].toLowerCase();


    if (type === "s") return amount * 1000;
    if (type === "m") return amount * 60 * 1000;
    if (type === "h") return amount * 60 * 60 * 1000;

    return null;
}



module.exports = {

    name: "rain",

    aliases: [],



    async execute(message, args) {


        if (
            !message.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {

            return message.reply(
                "❌ Only admins can start rain."
            );

        }




        const amount =
            Number(args[0]);


        const time =
            args[1];




        if (!amount || !time) {

            return message.reply(
                "❌ Usage: `.rain <amount> <time>`\nExample: `.rain 100 1h`"
            );

        }





        const duration =
            parseTime(time);




        if (!duration) {

            return message.reply(
                "❌ Invalid time format.\nExamples: `30m`, `1h`, `45s`"
            );

        }





        if (duration > 60 * 60 * 1000) {

            return message.reply(
                "❌ Maximum rain duration is 1 hour."
            );

        }





        if (
            activeRains.has(message.guild.id)
        ) {

            return message.reply(
                "❌ A rain is already active."
            );

        }





        if (
            !houseService.canPay(amount)
        ) {

            return message.reply(
                "❌ House does not have enough balance."
            );

        }





        const embed =
            new EmbedBuilder()

            .setTitle("🌧️ Rain Started!")

            .setDescription(
                [
                    `💰 Prize Pool: **${format.formatUSD(amount)}**`,
                    `⏳ Duration: **${time}**`,
                    "",
                    "React with 🌧️ to enter!",
                    "",
                    "Everyone gets an equal share."
                ].join("\n")
            )

            .setColor("Blue");






        const rainMessage =
            await message.channel.send({

                embeds:[embed]

            });





        await rainMessage.react("🌧️");





        activeRains.set(
            message.guild.id,
            true
        );





        const collector =
            rainMessage.createReactionCollector({

                filter:(reaction,user)=>{

                    return (
                        reaction.emoji.name === "🌧️" &&
                        !user.bot
                    );

                },

                time:duration

            });






        collector.on(
            "end",
            async()=>{


                activeRains.delete(
                    message.guild.id
                );





                let users = [];





                const reaction =
                    rainMessage.reactions.cache.get("🌧️");





                if (reaction) {


                    const reactedUsers =
                        await reaction.users.fetch();



                    users =
                        reactedUsers

                        .filter(
                            user => !user.bot
                        )

                        .map(
                            user => user.id
                        );

                }







                if (
                    users.length === 0
                ) {


                    return rainMessage.edit({

                        embeds:[

                            new EmbedBuilder()

                            .setTitle(
                                "🌧️ Rain Cancelled"
                            )

                            .setDescription(
                                "Nobody joined the rain."
                            )

                            .setColor("Red")

                        ]

                    });


                }








                const reward =
                    Math.floor(
                        amount / users.length
                    );






                if (
                    reward <= 0
                ) {


                    return rainMessage.edit({

                        embeds:[

                            new EmbedBuilder()

                            .setTitle(
                                "🌧️ Rain Failed"
                            )

                            .setDescription(
                                "Too many participants."
                            )

                            .setColor("Red")

                        ]

                    });


                }







                let winnerText = "";





                for (
                    const userId of users
                ) {


                    balanceService.addBalance(

                        userId,

                        reward,

                        "rain_reward"

                    );



                    winnerText +=
                    `<@${userId}> — **${format.formatUSD(reward)}**\n`;

                }







                houseService.remove(
                    reward * users.length
                );







                await rainMessage.edit({

                    embeds:[


                        new EmbedBuilder()

                        .setTitle(
                            "🌧️ Rain Finished!"
                        )


                        .setDescription(

                            [
                                "🏆 Winners:",
                                "",
                                winnerText,
                                "",
                                `💰 Total Paid: **${format.formatUSD(reward * users.length)}**`

                            ].join("\n")

                        )


                        .setColor("Green")

                    ]

                });



            }
        );



    }

};
