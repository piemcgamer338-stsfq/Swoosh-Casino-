const {
    AttachmentBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    createCanvas,
    loadImage
} = require("@napi-rs/canvas");

const path = require("path");



function getCardFile(card) {

    if (!card) return null;


    // New format
    if (card.image)
        return card.image;



    // Backup if old cards exist
    if (card.suit && card.value)
        return `${card.suit}${card.value}.png`;



    return null;

}




async function drawCard(ctx, card, x, y) {


    const file =
        getCardFile(card);



    if (!file) {

        console.log(
            "Invalid card:",
            card
        );

        return;

    }



    const imagePath =
        path.join(
            process.cwd(),
            "assets",
            "blackjack",
            file
        );



    const img =
        await loadImage(imagePath);



    ctx.drawImage(
        img,
        x,
        y,
        100,
        140
    );

}





async function gameEmbed(
    game,
    revealDealer = false
) {


    const canvas =
        createCanvas(
            900,
            500
        );


    const ctx =
        canvas.getContext("2d");



    const tablePath =
        path.join(
            process.cwd(),
            "assets",
            "blackjack",
            "table.png"
        );



    const table =
        await loadImage(tablePath);



    ctx.drawImage(
        table,
        0,
        0,
        900,
        500
    );





    // Dealer

    let dealerX = 300;



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


        }
        else{


            await drawCard(
                ctx,
                game.dealer[i],
                dealerX,
                60
            );


        }


        dealerX += 110;

    }







    // Player

    let playerX = 300;



    for(
        const card of game.player
    ){


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
        .setColor("#008000")
        .setTitle("🃏 Blackjack")
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
