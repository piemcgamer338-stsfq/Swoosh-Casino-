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
            await gameService.canBet(
                message.author.id,
                bet
            );


        if (!check.success) {

            return message.reply(
                `❌ ${check.message}`
            );

        }



        const positions =
            Array.from(
                {length:25},
                (_,i)=>i
            );


        const minePositions =
            positions
            .sort(()=>Math.random()-0.5)
            .slice(0,mines);



        let opened = [];
        let ended = false;



        function getMultiplier(){

            const safe =
                opened.length;


            const multiplier =
                1 + ((safe * mines) / 20);


            return Number(
                multiplier.toFixed(2)
            );

        }



        function createBoard(){


            const rows = [];


            for(let r=0;r<5;r++){


                const row =
                    new ActionRowBuilder();



                for(let c=0;c<5;c++){


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



            rows[4].components[4] =

                new ButtonBuilder()

                .setCustomId("cashout")

                .setLabel("💰")

                .setStyle(ButtonStyle.Success);



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
                            "💎 Pick tiles or cashout 💰"
                        ].join("\n")

                    )

                    .setColor("Gold")

                ],

                components:createBoard()

            });





        const collector =
            gameMessage.createMessageComponentCollector({

                componentType:ComponentType.Button,

                time:120000

            });






        collector.on("collect", async interaction=>{


            if(
                interaction.user.id !== message.author.id
            ){

                return interaction.reply({

                    content:"❌ This is not your game.",

                    ephemeral:true

                });

            }



            if(ended) return;



            await interaction.deferUpdate();




            if(interaction.customId === "cashout"){


                ended = true;


                const multiplier =
                    getMultiplier();



                const result =
                    await gameResultService.processWin(
                        message.author.id,
                        bet,
                        multiplier
                    );



                const user =
                    await userService.getUser(
                        message.author.id
                    );



                await gameMessage.edit({

                    embeds:[

                        new EmbedBuilder()

                        .setTitle("💣 Mines Cashout")

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





            if(
                minePositions.includes(index)
            ){


                ended=true;


                await gameResultService.processLoss(
                    message.author.id,
                    bet
                );



                await gameMessage.edit({

                    embeds:[

                        new EmbedBuilder()

                        .setTitle("💥 BOOM!")

                        .setDescription(

                            [
                                "💣 Mine exploded!",
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



            const multiplier =
                getMultiplier();




            await gameMessage.edit({

                embeds:[

                    new EmbedBuilder()

                    .setTitle("💣 Mines")

                    .setDescription(

                        [
                            `👤 Player: <@${message.author.id}>`,
                            `💰 Bet: **${format.formatUSD(bet)}**`,
                            `💣 Mines: **${mines}**`,
                            "",
                            `📈 Multiplier: **${multiplier}x**`,
                            "",
                            "Keep playing or cashout 💰"
                        ].join("\n")

                    )

                    .setColor("Green")

                ],

                components:createBoard()

            });



        });





        collector.on("end", async()=>{

            if(!ended){

                try{

                    await gameMessage.edit({
                        components:[]
                    });

                }catch{}

            }

        });



    }

};
