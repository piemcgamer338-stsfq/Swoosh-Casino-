const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ComponentType
} = require("discord.js");

const gameService = require("../../services/gameService");
const gameResultService = require("../../services/gameResultService");
const userService = require("../../services/userService");
const format = require("../../utils/format");


// Controlled 50/50 result generator
function getCoinResult(choice) {

    const patterns = [
        "win",
        "win",
        "lose",
        "win",
        "lose",
        "lose",
        "win",
        "lose",
        "win",
        "win"
    ];


    const outcome =
        patterns[Math.floor(Math.random() * patterns.length)];


    if (outcome === "win") {
        return choice;
    }


    return choice === "heads"
        ? "tails"
        : "heads";
}



module.exports = {

    name: "coinflip",

    aliases: [
        "cf"
    ],



    async execute(message, args) {


        const bet = Number(args[0]);



        if (!bet || bet <= 0) {

            return message.reply(
                "❌ Usage: `.cf <amount>`"
            );

        }



        const check =
            gameService.canBet(
                message.author.id,
                bet
            );



        if (!check.success) {

            return message.reply(
                `❌ ${check.message}`
            );

        }




        const startEmbed =
            new EmbedBuilder()

            .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })

            .setTitle("🪙 Coin Flip")

            .setDescription(
                [
                    `👤 Player: <@${message.author.id}>`,
                    `💰 Bet: **${format.formatUSD(bet)}**`,
                    "",
                    "Choose your side:"
                ].join("\n")
            )

            .setColor("Gold");





        const buttons =
            new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()
                .setCustomId("cf_heads")
                .setLabel("🟡 HEADS")
                .setStyle(ButtonStyle.Primary),


                new ButtonBuilder()
                .setCustomId("cf_tails")
                .setLabel("⚪ TAILS")
                .setStyle(ButtonStyle.Secondary)

            );





        const gameMessage =
            await message.reply({

                embeds:[
                    startEmbed
                ],

                components:[
                    buttons
                ]

            });






        const collector =
            gameMessage.createMessageComponentCollector({

                componentType:
                    ComponentType.Button,

                time:30000

            });






        collector.on(
            "collect",
            async interaction => {


                if (
                    interaction.user.id !==
                    message.author.id
                ) {


                    return interaction.reply({

                        content:
                            "❌ This is not your game.",

                        ephemeral:true

                    });


                }





                await interaction.deferUpdate();




                const choice =
                    interaction.customId === "cf_heads"
                    ? "heads"
                    : "tails";





                await gameMessage.edit({

                    embeds:[

                        new EmbedBuilder()

                        .setAuthor({

                            name:
                                message.author.username,

                            iconURL:
                                message.author.displayAvatarURL()

                        })

                        .setTitle(
                            "🪙 Coin Flip"
                        )

                        .setDescription(

                            [
                                `👤 Player: <@${message.author.id}>`,
                                "",
                                "🔄 Coin is flipping..."
                            ].join("\n")

                        )

                        .setColor(
                            "Yellow"
                        )

                    ],

                    components:[]

                });






                setTimeout(async()=>{


                    try {


                        const result =
                            getCoinResult(
                                choice
                            );



                        const won =
                            result === choice;



                        let resultText;



                        if(won){


                            const payout =
                                gameResultService.processWin(
                                    message.author.id,
                                    bet,
                                    2
                                );



                            resultText =
                                [
                                    "🎉 **You Won!**",
                                    `💰 Profit: **${format.formatUSD(payout.payout - bet)}**`
                                ].join("\n");



                        }else{


                            gameResultService.processLoss(
                                message.author.id,
                                bet
                            );



                            resultText =
                                [
                                    "❌ **You Lost!**",
                                    `💸 Lost: **${format.formatUSD(bet)}**`
                                ].join("\n");


                        }






                        const updated =
                            userService.getUser(
                                message.author.id
                            );





                        await gameMessage.edit({

                            embeds:[


                                new EmbedBuilder()

                                .setAuthor({

                                    name:
                                    message.author.username,

                                    iconURL:
                                    message.author.displayAvatarURL()

                                })


                                .setTitle(
                                    "🪙 Coin Flip Result"
                                )


                                .setDescription(

                                    [

                                    `👤 Player: <@${message.author.id}>`,

                                    "",

                                    `🪙 Landed on: **${result.toUpperCase()}**`,

                                    "",

                                    resultText,

                                    "",

                                    `💳 Balance: **${format.formatUSD(updated.balance)}**`

                                    ].join("\n")

                                )


                                .setColor(
                                    won
                                    ? "Green"
                                    : "Red"
                                )


                            ],


                            components:[]

                        });



                    }catch(error){


                        console.log(
                            "COINFLIP ERROR:",
                            error
                        );


                    }



                },3000);





                collector.stop();


            }
        );





        collector.on(
            "end",
            async()=>{

                try{

                    await gameMessage.edit({

                        components:[]

                    });

                }catch{}

            }
        );



    }

};
