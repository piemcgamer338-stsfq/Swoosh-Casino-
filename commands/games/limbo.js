const {
    EmbedBuilder
} = require("discord.js");


const {
    hasBalance,
    removeBalance,
    addBalance
} = require("../../services/balanceService");


const {
    createLimboImage
} = require("../../utils/limboRenderer");



module.exports = {

    name: "limbo",

    aliases: ["rocket"],



    async execute(message, args) {



        const bet =
            Number(args[0]);


        const target =
            Number(args[1]);



        if (
            !bet ||
            bet <= 0 ||
            !target ||
            target < 1.1
        ) {

            return message.reply(
                "❌ Usage: `.limbo <bet> <multiplier>`\nExample: `.limbo 10 2`"
            );

        }



        // max payout multiplier

        if(target > 5){

            return message.reply(
                "❌ Maximum multiplier is **5x**."
            );

        }




        const balance =
            await hasBalance(
                message.author.id,
                bet
            );



        if(!balance){

            return message.reply(
                "❌ You don't have enough balance."
            );

        }




        await removeBalance(
            message.author.id,
            bet,
            "limbo_bet"
        );





        const loading =
            await message.reply(
            {
                embeds:[

                    new EmbedBuilder()

                    .setColor("#f1c40f")

                    .setTitle("🚀 Limbo")

                    .setDescription(
`
💰 Bet:
**${bet} Points**

🎯 Target:
**${target.toFixed(2)}x**

🚀 Rocket launching...

⏳ Waiting...
`
                    )

                ]
            });




        // casino delay

        await new Promise(
            r => setTimeout(r,3000)
        );





        let crash;



        /*
            Low target trap

            Example:
            1.5x / 1.8x

            50% chance crash early
        */


        if(
            target < 2 &&
            Math.random() < 0.5
        ){


            crash =
                Number(
                    (
                        Math.random()
                        *
                        1.8
                        +
                        1
                    )
                    .toFixed(2)
                );


        }

        else {


            crash =
                Number(
                    (
                        Math.random()
                        *
                        100
                        +
                        1
                    )
                    .toFixed(2)
                );


        }




        let win = false;



        if(crash >= target){

            win = true;

        }




        let payout = 0;



        if(win){


            payout =
                Math.floor(
                    bet * target
                );


            await addBalance(

                message.author.id,

                payout,

                "limbo_win"

            );

        }





        const image =
            await createLimboImage({

                bet,

                target:
                    target.toFixed(2),

                crash:
                    crash.toFixed(2),

                win,

                payout

            });





        const embed =
            new EmbedBuilder()

            .setColor(
                win
                ?
                "#2ecc71"
                :
                "#e74c3c"
            )

            .setTitle(
                "🚀 Limbo Result"
            )

            .setDescription(
                win
                ?
`
🏆 **You Won!**

💰 Payout:
**${payout} Points**
`
                :
`
💀 **You Lost!**

Better luck next time.
`
            )

            .setImage(
                "attachment://limbo-result.png"
            );





        return loading.edit({

            embeds:[
                embed
            ],

            files:[
                image
            ]

        });



    }

};
