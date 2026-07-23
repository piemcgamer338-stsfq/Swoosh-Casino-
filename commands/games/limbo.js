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



function generateCrash(){


    const roll =
        Math.random();


    let crash;



    if(roll < 0.55){

        // common crashes
        crash =
            1 +
            Math.random() * 2;


    }

    else if(roll < 0.85){

        // medium
        crash =
            2 +
            Math.random() * 8;


    }

    else if(roll < 0.98){

        // rare
        crash =
            10 +
            Math.random() * 40;


    }

    else{

        // jackpot
        crash =
            50 +
            Math.random() * 50;

    }



    return Number(
        crash.toFixed(2)
    );

}





module.exports = {


    name:"limbo",

    aliases:["rocket"],



    async execute(message,args){



        const bet =
            Number(args[0]);


        const target =
            Number(args[1]);



        if(
            !bet ||
            bet <= 0 ||
            !target
        ){

            return message.reply(
                "❌ Usage: `.limbo <bet> <multiplier>`\nExample: `.limbo 10 2`"
            );

        }




        if(target < 1.1){

            return message.reply(
                "❌ Minimum multiplier is 1.10x"
            );

        }



        if(target > 100){

            return message.reply(
                "❌ Maximum multiplier is 100x"
            );

        }




        const canPlay =
            await hasBalance(
                message.author.id,
                bet
            );



        if(!canPlay){

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
            await message.reply({

                embeds:[

                    new EmbedBuilder()

                    .setColor("#f39c12")

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






        await new Promise(
            resolve =>
            setTimeout(resolve,3000)
        );





        const crash =
            generateCrash();





        const win =
            crash >= target;





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
🏆 **YOU WON**

💰 Payout:
**${payout} Points**
`

                :

`
💀 **YOU LOST**

Rocket crashed too early.
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
