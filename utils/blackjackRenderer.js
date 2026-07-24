const {
    AttachmentBuilder,
    EmbedBuilder
} = require("discord.js");

const Canvas = require("canvas");
const path = require("path");


function getCardCode(card) {

    const suits = {
        "♣":"C",
        "♦":"D",
        "♥":"H",
        "♠":"S"
    };

    return suits[card.suit] + card.value;

}



async function drawCard(ctx, card, x, y) {

    const code = getCardCode(card);

    const img = await Canvas.loadImage(

        path.join(
            process.cwd(),
            "assets",
            "blackjack",
            `${code}.png`
        )

    );


    ctx.drawImage(
        img,
        x,
        y,
        100,
        140
    );

}




async function gameEmbed(game, revealDealer=false) {


    const canvas =
        Canvas.createCanvas(
            900,
            500
        );


    const ctx =
        canvas.getContext("2d");



    const table =
        await Canvas.loadImage(

            path.join(
                process.cwd(),
                "assets",
                "blackjack",
                "table.png"
            )

        );



    ctx.drawImage(
        table,
        0,
        0,
        900,
        500
    );



    // Dealer cards

    let dx = 300;


    for(
        let i = 0;
        i < game.dealer.length;
        i++
    ){


        if(
            i === 0 &&
            !revealDealer
        ){

            const back =
                await Canvas.loadImage(

                    path.join(
                        process.cwd(),
                        "assets",
                        "blackjack",
                        "BACK.png"
                    )

                );


            ctx.drawImage(
                back,
                dx,
                60,
                100,
                140
            );


        } else {


            await drawCard(
                ctx,
                game.dealer[i],
                dx,
                60
            );


        }


        dx += 110;

    }




    // Player cards

    let px = 300;


    for(
        const card of game.player
    ){

        await drawCard(
            ctx,
            card,
            px,
            300
        );


        px += 110;

    }





    ctx.font =
        "bold 35px Arial";


    ctx.fillStyle =
        "white";


    ctx.fillText(

        `Bet: ${game.bet}`,

        40,
        60

    );



    const buffer =
        canvas.toBuffer();



    const attachment =
        new AttachmentBuilder(

            buffer,

            {
                name:
                "blackjack.png"
            }

        );



    const embed =
        new EmbedBuilder()

        .setColor("#075e28")

        .setTitle(
            "🃏 Blackjack"
        )

        .setImage(
            "attachment://blackjack.png"
        );



    return {

        embeds:[
            embed
        ],

        files:[
            attachment
        ]

    };


}



module.exports = {
    gameEmbed
};
