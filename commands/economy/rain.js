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

}



module.exports = {

    name: "rain",

    aliases: [],


    async execute(message, args) {


        // ADMIN ONLY

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
                "❌ Invalid time.\nExamples: `30m`, `1h`, `45s`"
            );

        }



        if (duration > 60 * 60 * 1000) {

            return message.reply(
                "❌ Maximum rain time is 1 hour."
            );

        }



        if (activeRains.has(message.guild.id)) {

            return message.reply(
                "❌ A rain is already active."
            );

        }





        if (!houseService.canPay(amount)) {

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
                    `⏳ Ends in: **${time}**`,
                    "",
                    "React with 🌧️ to join!",
                    "",
                    "Everyone who joins will receive an equal share."
                ].join("\n")

            )

            .setColor("Blue");





        const rainMessage =
            await message.channel.send({

                embeds:[embed]

            });





        await rainMessage.react("🌧️");





        const participants =
            new Set();




        const collector =
            rainMessage.createReactionCollector({

                filter:
                (reaction,user)=>{

                    return (
                        reaction.emoji.name === "🌧️" &&
                        !user.bot
                    );

                },

                time: duration

            });





        collector.on(
            "collect",
            (reaction,user)=>{

                participants.add(user.id);

            }
        );





        activeRains.set(
            message.guild.id,
            true
        );





        collector.on(
            "end",
            async()=>{


                activeRains.delete(
                    message.guild.id
                );




                const users =
                    [...participants];



                if(users.length === 0){


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



                const paid =
                    reward * users.length;



                if(reward <= 0){

                    return rainMessage.edit({

                        embeds:[

                            new EmbedBuilder()

                            .setTitle(
                                "🌧️ Rain Failed"
                            )

                            .setDescription(
                                "Too many players joined."
                            )

                            .setColor("Red")

                        ]

                    });

                }






                let winnersText = "";



                for(
                    const id of users
                ){


                    balanceService.addBalance(

                        id,

                        reward,

                        "rain_reward"

                    );


                    winnersText +=
                    `<@${id}> — **${format.formatUSD(reward)}**\n`;

                }




                // remove money from house

                houseService.remove(
                    paid
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
                                winnersText,
                                "",
                                `💰 Total Paid: **${format.formatUSD(paid)}**`
                            ].join("\n")

                        )

                        .setColor("Green")

                    ]

                });


            }
        );


    }

};
