const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ComponentType
} = require("discord.js");

const gameService = require("../../services/gameService");
const balanceService = require("../../services/balanceService");
const userService = require("../../services/userService");
const format = require("../../utils/format");


const HEAD_IMAGE =
"https://media.discordapp.net/attachments/1529485009277292665/1529692103356190942/image.png?ex=6a62dc49&is=6a618ac9&hm=92dbba4e43551dc0bdfe204dddc084862c76dea10a05bfae9dec0d4e24029128&=&format=webp&quality=lossless&width=464&height=363";


const TAIL_IMAGE =
"https://media.discordapp.net/attachments/1529485009277292665/1529692109811089579/image.png?ex=6a62dc4b&is=6a618acb&hm=7b5834726343c436b6e16742b55dcd483ebf0dd4e32d1cd0baa5ff8add458d1a&=&format=webp&quality=lossless&width=469&height=371";



function flipCoin(choice) {

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
        patterns[
            Math.floor(Math.random() * patterns.length)
        ];


    if (outcome === "win") {
        return choice;
    }


    return choice === "heads"
        ? "tails"
        : "heads";

}



module.exports = {

    name: "coinflip",

    aliases: ["cf"],


    async execute(message,args) {


        const bet =
            Number(args[0]);


        if(!bet || bet <= 0) {

            return message.reply(
                "❌ Usage: `.cf <amount>`"
            );

        }



        const check =
            gameService.canBet(
                message.author.id,
                bet
            );


        if(!check.success){

            return message.reply(
                `❌ ${check.message}`
            );

        }



        // REMOVE BET FIRST
        balanceService.removeBalance(
            message.author.id,
            bet,
            "coinflip_bet"
        );




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
                            `💰 Bet: **${format.formatUSD(bet)}**`,
                            "",
                            "Choose your side:"
                        ].join("\n")

                    )

                    .setColor("Gold")

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
            async interaction=>{


                if(
                    interaction.user.id !== message.author.id
                ){

                    return interaction.reply({

                        content:
                        "❌ This is not your coinflip.",

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
                            "🔄 Coin is flipping..."
                        )

                        .setColor("Yellow")

                    ],

                    components:[]

                });






                setTimeout(async()=>{


                    const result =
                        flipCoin(choice);



                    const won =
                        result === choice;




                    let text;

                    let payout = 0;



                    if(won){


                        payout =
                            bet * 2;



                        balanceService.addBalance(

                            message.author.id,

                            payout,

                            "coinflip_win"

                        );



                        text =

                        [
                            "🎉 **You Won!**",

                            `💰 Won: **${format.formatUSD(payout)}**`

                        ].join("\n");



                    } else {


                        text =

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

                                text,

                                "",

                                `💳 Balance: **${format.formatUSD(updated.balance)}**`

                                ].join("\n")

                            )


                            .setColor(
                                won ? "Green" : "Red"
                            )


                            .setImage(

                                result === "heads"
                                ? HEAD_IMAGE
                                : TAIL_IMAGE

                            )

                        ],

                        components:[]

                    });



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
