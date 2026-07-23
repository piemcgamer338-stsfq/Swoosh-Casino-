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


        const check = gameService.canBet(
            message.author.id,
            bet
        );


        if (!check.success) {
            return message.reply(
                `❌ ${check.message}`
            );
        }



        const minePositions = [];


        while (minePositions.length < mines) {

            const random =
                Math.floor(Math.random() * 25);


            if (!minePositions.includes(random)) {
                minePositions.push(random);
            }

        }



        let opened = [];
        let ended = false;



        function getMultiplier() {

            const safe =
                25 - mines;


            return Number(
                Math.pow(
                    1.15,
                    opened.length
                ).toFixed(2)
            );

        }





        function createGrid() {

            const rows = [];


            for (let r = 0; r < 5; r++) {

                const row =
                    new ActionRowBuilder();



                for (let c = 0; c < 5; c++) {


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
                        "Click tiles or cashout."

                        ].join("\n")

                    )

                    .setColor("Gold")

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




                if (ended) return;






                if (
                    interaction.customId ===
                    "mine_cashout"
                ) {



                    ended = true;



                    const multiplier =
                        getMultiplier();



                    const result =
                        gameResultService.processWin(
                            message.author.id,
                            bet,
                            multiplier
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
                                `📈 Multiplier: **${multiplier}x**`,
                                `💰 Won: **${format.formatUSD(result.payout)}**`,
                                "",
                                `💳 Balance: **${format.formatUSD(user.balance)}**`

                                ].join("\n")

                            )

                            .setColor("Green")

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





                if (
                    minePositions.includes(index)
                ) {



                    ended = true;



                    gameResultService.processLoss(
                        message.author.id,
                        bet
                    );



                    await interaction.update({

                        embeds:[

                            new EmbedBuilder()

                            .setTitle(
                                "💥 Mine Hit!"
                            )

                            .setDescription(

                                [

                                `💣 You hit a mine.`,
                                `💸 Lost: **${format.formatUSD(bet)}**`

                                ].join("\n")

                            )

                            .setColor("Red")

                        ],

                        components:[]

                    });



                    collector.stop();

                    return;

                }






                opened.push(index);



                const multiplier =
                    getMultiplier();




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
                            `📈 Multiplier: **${multiplier}x**`,
                            "",
                            "Continue or cashout."

                            ].join("\n")

                        )

                        .setColor("Green")


                    ],

                    components:
                    createGrid()

                });



            }

        );




        collector.on(
            "end",
            async()=>{

                if(!ended){

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
