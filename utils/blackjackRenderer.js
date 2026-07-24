// utils/blackjackRenderer.js

const {
    EmbedBuilder,
    AttachmentBuilder
} = require("discord.js");

const path = require("path");


function cardFile(card) {

    return path.join(
        process.cwd(),
        "assets",
        "blackjack",
        `${card}.png`
    );

}



function gameEmbed(game, revealDealer = false) {


    const files = [];

    const playerImages = [];
    const dealerImages = [];



    // PLAYER CARDS

    for (const card of game.player) {

        const file = new AttachmentBuilder(
            cardFile(card)
        );

        files.push(file);

        playerImages.push(
            `attachment://${card}.png`
        );

    }



    // DEALER CARDS

    if (revealDealer) {


        for (const card of game.dealer) {

            const file = new AttachmentBuilder(
                cardFile(card)
            );

            files.push(file);

            dealerImages.push(
                `attachment://${card}.png`
            );

        }


    } else {


        const hidden = new AttachmentBuilder(

            cardFile("BACK")

        );

        files.push(hidden);


        dealerImages.push(
            "attachment://BACK.png"
        );


        dealerImages.push(
            `attachment://${game.dealer[1]}.png`
        );


    }





    const embed = new EmbedBuilder()

        .setColor("#0b6623")

        .setTitle(
            "🃏 Blackjack"
        )


        .addFields(

            {
                name:"Dealer",

                value:
                dealerImages
                .map(x=>`🂠 ${x}`)
                .join("\n")
            },


            {

                name:"Player",

                value:
                playerImages
                .join("\n")

            }

        )


        .setDescription(

`
💰 Bet: **${game.bet} Points**

Hit or Stand?
`

        );



    return {

        embeds:[
            embed
        ],

        files

    };


}



module.exports = {

    gameEmbed

};
