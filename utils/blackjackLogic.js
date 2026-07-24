const {
    AttachmentBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    createCanvas,
    loadImage
} = require("@napi-rs/canvas");

const path = require("path");


async function drawCard(ctx, card, x, y) {


    const file =
        path.join(
            process.cwd(),
            "assets",
            "blackjack",
            card.image
        );


    const img =
        await loadImage(file);


    ctx.drawImage(
        img,
        x,
        y,
        100,
        140
    );

}




async function gameEmbed(game, revealDealer = false) {


    const canvas =
        createCanvas(
            900,
            500
        );


    const ctx =
        canvas.getContext("2d");



    const table =
        await loadImage(

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

    let dealerX = 300;


    for (
        let i = 0;
        i < game.dealer.length;
        i++
    ) {


        if (
            i === 0 &&
            !revealDealer
        ) {


            const back =
                await loadImage(

                    path.join(
                        process.cwd(),
                        "assets",
                        "blackjack",
                        "BACK.png"
                    )

                );


            ctx.drawImage(
                back,
                dealerX,
                60,
                100,
                140
            );


        } else {


            await drawCard(
                ctx,
                game.dealer[i],
                dealerX,
                60
            );


        }


        dealerX += 110;

    }




    // Player cards

    let playerX = 300;


    for (
        const card of game.player
    ) {


        await drawCard(
            ctx,
            card,
            playerX,
            300
        );


        playerX += 110;


    }





    ctx.font =
        "bold 30px Arial";


    ctx.fillStyle =
        "white";


    ctx.fillText(
        `BET: ${game.bet}`,
        40,
        50
    );



    const buffer =
        canvas.toBuffer(
            "image/png"
        );



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

        .setColor("#006400")

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
