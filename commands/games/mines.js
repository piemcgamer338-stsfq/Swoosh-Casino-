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



module.exports = {

    name: "mines",

    aliases: ["mine"],



    async execute(message, args) {


        const bet = Number(args[0]);
        const mines = Number(args[1]);



        if (!bet || !mines) {

            return message.reply(
                "❌ Usage: `.mines <amount> <mines>`\nExample: `.mines 100 5`"
            );

        }



        if (mines < 1 || mines > 20) {

            return message.reply(
                "❌ Mines must be between 1 and 20."
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




        // Create 25 slots
        const slots =
            Array.from(
                { length: 25 },
                (_, i) => i
            );



        // Random mine positions
        const minePositions =
            slots
            .sort(
                () => Math.random() - 0.5
            )
            .slice(0, mines);




        let opened = [];

        let multiplier = 1;

        let finished = false;




        function calculateMultiplier() {


            const safeTiles =
                25 - mines;



            multiplier =
                Math.pow(
                    25 / safeTiles,
                    opened.length
                );



            return multiplier.toFixed(2);

        }





        function createGrid() {


            const rows = [];



            for(let r = 0; r < 5; r++) {


                const row =
                    new ActionRowBuilder();



                for(let c = 0; c < 5; c++) {


                    const index =
                        r * 5 + c;



                    row.addComponents(

                        new ButtonBuilder()

                        .setCustomId(
                            `mine_${index}`
                        )

                        .setLabel(
                            opened.includes(index)
                            ? "💎"
                            : "⬜"
                        )

                        .setStyle(

                            opened.includes(index)
                            ? ButtonStyle.Success
                            : ButtonStyle.Secondary

                        )

                    );


                }



                rows.push(row);

            }




            // Cashout button

            rows.push(

                new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                    .setCustomId(
                        "mine_cashout"
                    )

                    .setLabel(
                        "💰 CASHOUT"
                    )

                    .setStyle(
                        ButtonStyle.Success
                    )

                )

            );



            return rows;

        }







        const gameMessage =
            await message.reply({

                embeds:[


                    new EmbedBuilder()

                    .setTitle(
                        "💣 Mines"
                    )

                    .setDescription(

                        [

                        `👤 Player: <@${message.author.id}>`,

                        `💰 Bet: **${format.formatUSD(bet)}**`,

                        `💣 Mines: **${mines}**`,

                        "",

                        `📈 Multiplier: **1.00x**`,

                        "",

                        "Choose tiles or cashout."

                        ].join("\n")

                    )

                    .setColor(
                        "Gold"
                    )


                ],


                components:
                createGrid()


            });








        const collector =
            gameMessage.createMessageComponentCollector({

                componentType:
                    ComponentType.Button,

                time:
                    120000

            });








        collector.on(
            "collect",
            async interaction => {



                if(
                    interaction.user.id !==
                    message.author.id
                ){

                    return interaction.reply({

                        content:
                        "❌ This is not your game.",

                        ephemeral:true

                    });

                }





                if(finished)
                    return;






                // CASHOUT

                if(
                    interaction.customId ===
                    "mine_cashout"
                ){



                    finished = true;



                    const payout =
                        Math.floor(
                            bet *
                            Number(
                                calculateMultiplier()
                            )
                        );



                    gameResultService.processWin(
                        message.author.id,
                        payout,
                        1
                    );



                    const user =
                        userService.getUser(
                            message.author.id
                        );



                    await interaction.update({

                        embeds:[


                            new EmbedBuilder()

                            .setTitle(
                                "💣 Mines Cashout"
                            )

                            .setDescription(

                                [

                                `👤 Player: <@${message.author.id}>`,

                                "",

                                `📈 Multiplier: **${calculateMultiplier()}x**`,

                                `💰 Won: **${format.formatUSD(payout)}**`,

                                "",

                                `💳 Balance: **${format.formatUSD(user.balance)}**`

                                ].join("\n")

                            )

                            .setColor(
                                "Green"
                            )

                        ],

                        components:[]

                    });



                    collector.stop();

                    return;

                }








                const index =
                    Number(
                        interaction.customId.split("_")[1]
                    );






                if(
                    minePositions.includes(index)
                ){



                    finished = true;



                    gameResultService.processLoss(
                        message.author.id,
                        bet
                    );



                    await interaction.update({

                        embeds:[


                            new EmbedBuilder()

                            .setTitle(
                                "💥 BOOM!"
                            )

                            .setDescription(

                                [

                                `💣 You hit a mine.`,

                                `💸 Lost: **${format.formatUSD(bet)}**`

                                ].join("\n")

                            )

                            .setColor(
                                "Red"
                            )

                        ],


                        components:[]

                    });



                    collector.stop();

                    return;

                }






                opened.push(index);






                await interaction.update({

                    embeds:[


                        new EmbedBuilder()

                        .setTitle(
                            "💣 Mines"
                        )


                        .setDescription(

                            [

                            `👤 Player: <@${message.author.id}>`,

                            `💰 Bet: **${format.formatUSD(bet)}**`,

                            `💣 Mines: **${mines}**`,

                            "",

                            `📈 Multiplier: **${calculateMultiplier()}x**`,

                            "",

                            "Keep going or cashout."

                            ].join("\n")

                        )


                        .setColor(
                            "Green"
                        )

                    ],


                    components:
                    createGrid()

                });



            }

        );






        collector.on(
            "end",
            async()=>{


                if(!finished){

                    try{

                        await gameMessage.edit({

                            components:[]

                        });

                    }catch{}

                }


            }
        );



    }

};
