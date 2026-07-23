const {
    EmbedBuilder
} = require("discord.js");


const {
    rouletteGames
} = require("../commands/games/roulette");


const balanceService =
    require("../services/balanceService");



const redNumbers = [
    1,3,5,7,9,
    12,14,16,18,19,
    21,23,25,27,30,
    32,34,36
];



function getColumn(number) {

    if (number === 0)
        return 0;


    if (number % 3 === 1)
        return 1;


    if (number % 3 === 2)
        return 2;


    return 3;

}




function checkBet(type, number) {


    const color =
        redNumbers.includes(number)
        ? "red"
        : number === 0
        ? "green"
        : "black";



    switch(type) {


        case "roulette_col1":
            return getColumn(number) === 1;


        case "roulette_col2":
            return getColumn(number) === 2;


        case "roulette_col3":
            return getColumn(number) === 3;


        case "roulette_red":
            return color === "red";


        case "roulette_black":
            return color === "black";


        case "roulette_odd":
            return number !== 0 &&
            number % 2 !== 0;


        case "roulette_even":
            return number !== 0 &&
            number % 2 === 0;


        case "roulette_low":
            return number >= 1 &&
            number <= 16;


        case "roulette_high":
            return number >= 17 &&
            number <= 36;


        default:
            return false;

    }

}





module.exports = {


    customIdRegex:
    /^roulette_/,



    async execute(interaction) {


        // instantly tell Discord we received click
        await interaction.deferUpdate();




        const game =
            rouletteGames.get(
                interaction.message.id
            );



        if (!game) {


            return interaction.editReply({

                content:
                "❌ Roulette expired.",

                components:[]

            });

        }




        if (
            interaction.user.id !== game.userId
        ) {


            return interaction.followUp({

                content:
                "❌ This is not your roulette.",

                ephemeral:true

            });

        }





        if (
            !game.bets.includes(
                interaction.customId
            )
        ) {


            game.bets.push(
                interaction.customId
            );

        }






        const totalBet =
            game.bet *
            game.bets.length;






        const hasBalance =
            await balanceService.hasBalance(

                game.userId,

                totalBet

            );





        if(!hasBalance) {


            rouletteGames.delete(
                interaction.message.id
            );


            return interaction.editReply({


                embeds:[

                    new EmbedBuilder()

                    .setColor("#ff0000")

                    .setTitle(
                        "🎰 Roulette Cancelled"
                    )

                    .setDescription(
`
❌ Not enough balance.

Selected:
${game.bets.length} bets

Required:
${totalBet} Points
`
                    )

                ],


                components:[]

            });


        }








        // update selected buttons


        await interaction.editReply({


            content:

`🎰 Bets Selected: **${game.bets.length}**

💰 Total Bet: **${totalBet} Points**`,


            components:
            interaction.message.components


        });








        // wait until 3 choices


        if(game.bets.length < 3)
            return;








        await balanceService.removeBalance(

            game.userId,

            totalBet,

            "roulette_bet"

        );






        await interaction.editReply({

            content:
            "🎰 **Roulette spinning...**",

            embeds:[],

            components:[]

        });






        await new Promise(resolve =>
            setTimeout(resolve,5000)
        );







        const number =
            Math.floor(
                Math.random()*37
            );




        const color =
            redNumbers.includes(number)
            ?
            "🔴 Red"
            :
            number === 0
            ?
            "🟢 Green"
            :
            "⚫ Black";





        let payout = 0;





        for(
            const bet of game.bets
        ) {


            if(
                checkBet(
                    bet,
                    number
                )
            ) {


                if(
                    bet.includes("col")
                ) {


                    payout +=
                    game.bet * 3;


                } else {


                    payout +=
                    game.bet * 2;


                }


            }


        }







        if(payout > 0) {


            await balanceService.addBalance(

                game.userId,

                payout,

                "roulette_win"

            );

        }








        await interaction.editReply({



            embeds:[

                new EmbedBuilder()

                .setColor(
                    payout
                    ?
                    "#00ff88"
                    :
                    "#ff0000"
                )


                .setTitle(
                    "🎰 Roulette Result"
                )


                .setDescription(
`
# 🎲 ${number}

${color}

Column:
${getColumn(number) || "None"}


${
payout
?
`🏆 Won: **${payout} Points**`
:
"💀 You Lost"
}

`
                )

            ],


            components:[]

        });






        rouletteGames.delete(
            interaction.message.id
        );



    }


};
