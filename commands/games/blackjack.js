const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");

const blackjackGames = require("../../games/blackjackManager");
const { createCanvas } = require("@napi-rs/canvas");


const suits = [
    "♠",
    "♥",
    "♦",
    "♣"
];

const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
];


function randomCard(){

    return {
        suit: suits[Math.floor(Math.random()*suits.length)],
        value: values[Math.floor(Math.random()*values.length)]
    };

}



function drawCard(ctx, card, x, y){

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.roundRect(
        x,
        y,
        130,
        180,
        15
    );
    ctx.fill();


    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;

    ctx.stroke();



    ctx.fillStyle =
        card.suit === "♥" || card.suit === "♦"
        ? "#dc2626"
        : "#111827";


    ctx.font = "45px Arial";


    ctx.fillText(
        card.value,
        x + 20,
        y + 55
    );


    ctx.fillText(
        card.suit,
        x + 45,
        y + 120
    );


}





async function createBlackjackImage(player,dealer){


    const canvas =
        createCanvas(
            1200,
            700
        );


    const ctx =
        canvas.getContext("2d");



    ctx.fillStyle="#111827";

    ctx.fillRect(
        0,
        0,
        1200,
        700
    );



    ctx.fillStyle="#ffffff";

    ctx.font="40px Arial";


    ctx.fillText(
        "Dealer",
        80,
        70
    );


    ctx.fillText(
        "Player",
        80,
        370
    );



    let x = 80;


    for(let i=0;i<dealer.length;i++){


        if(i===0){

            ctx.fillStyle="#1e40af";

            ctx.beginPath();

            ctx.roundRect(
                x,
                100,
                130,
                180,
                15
            );

            ctx.fill();


            ctx.fillStyle="#ffffff";

            ctx.font="50px Arial";

            ctx.fillText(
                "?",
                x+45,
                210
            );


        }else{

            drawCard(
                ctx,
                dealer[i],
                x,
                100
            );

        }


        x += 150;

    }




    x = 80;


    for(const card of player){


        drawCard(
            ctx,
            card,
            x,
            400
        );


        x += 150;

    }



    return canvas.toBuffer();

}







module.exports = {


    name:"blackjack",

    aliases:[
        "bj"
    ],



    async execute(message,args){



        const bet =
            Number(args[0]);



        if(
            !bet ||
            bet <= 0
        ){

            return message.reply(
                "❌ Enter a valid bet."
            );

        }



        const player=[

            randomCard(),

            randomCard()

        ];



        const dealer=[

            randomCard(),

            randomCard()

        ];



        const image =
            await createBlackjackImage(
                player,
                dealer
            );



        const msg =
        await message.reply({


            content:

            `🃏 **Blackjack**\nBet: **${bet} Points**`,



            files:[

                new AttachmentBuilder(
                    image,
                    {
                        name:"blackjack.png"
                    }
                )

            ],



            components:[

                new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                    .setCustomId(
                        "bj_hit"
                    )

                    .setLabel(
                        "Hit"
                    )

                    .setStyle(
                        ButtonStyle.Success
                    ),


                    new ButtonBuilder()

                    .setCustomId(
                        "bj_stand"
                    )

                    .setLabel(
                        "Stand"
                    )

                    .setStyle(
                        ButtonStyle.Danger
                    )

                )

            ]

        });



        blackjackGames.set(

            msg.id,

            {

                userId:
                message.author.id,

                bet,

                player,

                dealer

            }

        );


    }

};
