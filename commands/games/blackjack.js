const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");

const blackjackGames = require("../../games/blackjackManager");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const fs = require("fs");
const path = require("path");


const CARD_PATH = path.join(
    process.cwd(),
    "assets",
    "blackjack"
);


function randomCard() {

    const suits = [
        "C",
        "D",
        "H",
        "S"
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


    return {
        suit: suits[Math.floor(Math.random() * suits.length)],
        value: values[Math.floor(Math.random() * values.length)]
    };

}



function cardFile(card) {

    if (
        !card ||
        !card.suit ||
        !card.value
    ) {
        return null;
    }


    return `${card.suit}${card.value}.png`;

}



async function drawCard(ctx, card, x, y) {

    const file = cardFile(card);


    if (!file)
        return;


    const fullPath = path.join(
        CARD_PATH,
        file
    );


    if (!fs.existsSync(fullPath))
        return;


    const img = await loadImage(fullPath);


    ctx.drawImage(
        img,
        x,
        y,
        130,
        180
    );

}




async function createBlackjackImage(player, dealer) {

    const canvas = createCanvas(
        1200,
        700
    );


    const ctx = canvas.getContext("2d");


    ctx.fillStyle = "#111827";

    ctx.fillRect(
        0,
        0,
        1200,
        700
    );


    ctx.fillStyle = "#ffffff";

    ctx.font = "40px Arial";


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


    // Dealer cards

    for(
        let i = 0;
        i < dealer.length;
        i++
    ){

        if(i === 0){

            const back =
                path.join(
                    CARD_PATH,
                    "card-back.png"
                );


            if(fs.existsSync(back)){

                const img =
                    await loadImage(back);


                ctx.drawImage(
                    img,
                    x,
                    100,
                    130,
                    180
                );

            }

        }
        else {

            await drawCard(
                ctx,
                dealer[i],
                x,
                100
            );

        }


        x += 150;

    }



    x = 80;


    // Player cards

    for(const card of player){

        await drawCard(
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

    name: "blackjack",

    aliases: [
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



        const player = [

            randomCard(),
            randomCard()

        ];



        const dealer = [

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
                            name:
                            "blackjack.png"
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
