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


module.exports = {

    name: "mines",
    aliases: ["mine"],


    async execute(message, args) {

        const bet = Number(args[0]);
        const mines = Number(args[1]);


        if (!bet || !mines) {
            return message.reply(
                "❌ Usage: `.mines <amount> <mines>`"
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



        // LOCK BET
        balanceService.removeBalance(
            message.author.id,
            bet,
            "mines_bet"
        );



        const slots =
            Array.from(
                {length:25},
                (_,i)=>i
            );


        const minePositions =
            slots
            .sort(()=>Math.random()-0.5)
            .slice(0,mines);



        let opened = [];
        let ended = false;



        function multiplier(){

            const safe = opened.length;

            return Number(
                (
                    Math.pow(
                        1 + mines * 0.08,
                        safe
                    )
                ).toFixed(2)
            );

        }




        function board(){

            const rows=[];


            for(let r=0;r<5;r++){

                const row =
                    new ActionRowBuilder();


                for(let c=0;c<5;c++){

                    const id =
                        r*5+c;


                    row.addComponents(

                        new ButtonBuilder()

                        .setCustomId(
                            `mine_${id}`
                        )

                        .setLabel(
                            opened.includes(id)
                            ? "💎"
                            : "⬜"
                        )

                        .setStyle(
                            opened.includes(id)
                            ? ButtonStyle.Success
                            : ButtonStyle.Secondary
                        )

                    );

                }


                rows.push(row);

            }


            rows[4].components[4] =
                new ButtonBuilder()

                .setCustomId("cashout")

                .setLabel("💰")

                .setStyle(
                    ButtonStyle.Success
                );


            return rows;

        }




        const gameMessage =
            await message.reply({

                embeds:[

                    new EmbedBuilder()

                    .setTitle("💣 Mines")

                    .setDescription(
                        [
                            `👤 Player: <@${message.author.id}>`,
                            `💰 Bet: **${format.formatUSD(bet)}**`,
                            `💣 Mines: **${mines}**`,
                            "",
                            "📈 Multiplier: **1.00x**",
                            "",
                            "💎 Find diamonds or cashout"
                        ].join("\n")
                    )

                    .setColor("Gold")

                ],

                components:
                board()

            });





        const collector =
            gameMessage.createMessageComponentCollector({

                componentType:
                ComponentType.Button,

                time:120000

            });





        collector.on(
            "collect",
            async interaction=>{


                if(
                    interaction.user.id !== message.author.id
                ){

                    return interaction.reply({

                        content:
                        "❌ Not your game.",

                        ephemeral:true

                    });

                }



                if(ended) return;




                if(
                    interaction.customId === "cashout"
                ){

                    ended=true;


                    const multi =
                        multiplier();


                    const payout =
                        Math.floor(
                            bet * multi
                        );



                    balanceService.addBalance(
                        message.author.id,
                        payout,
                        "mines_cashout"
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
                                    `📈 Multiplier: **${multi}x**`,
                                    `💰 Won: **${format.formatUSD(payout)}**`,
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




                if(
                    minePositions.includes(index)
                ){

                    ended=true;



                    await interaction.update({

                        embeds:[

                            new EmbedBuilder()

                            .setTitle(
                                "💥 BOOM!"
                            )

                            .setDescription(
                                [
                                    `💣 Mine hit!`,
                                    "",
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



                const multi =
                    multiplier();



                await interaction.update({

                    embeds:[

                        new EmbedBuilder()

                        .setTitle(
                            "💣 Mines"
                        )

                        .setDescription(
                            [
                                `👤 Player: <@${message.author.id}>`,
                                "",
                                `💣 Mines: **${mines}**`,
                                `📈 Multiplier: **${multi}x**`,
                                "",
                                "Keep going or cashout 💰"
                            ].join("\n")
                        )

                        .setColor("Green")

                    ],

                    components:
                    board()

                });


            }
        );

    }

};
