const {
    EmbedBuilder,
    AttachmentBuilder
} = require("discord.js");

const path = require("path");


function getCardCode(card) {


    const suits = {

        "♣": "C",
        "♦": "D",
        "♥": "H",
        "♠": "S"

    };


    return (
        suits[card.suit] +
        card.value
    );

}



function getCardPath(card) {


    const code =
        getCardCode(card);


    return path.join(

        process.cwd(),

        "assets",

        "blackjack",

        `${code}.png`

    );

}





function gameEmbed(game, revealDealer = false) {


    const files = [];


    const playerImages = [];

    const dealerImages = [];



    // PLAYER CARDS

    for (const card of game.player) {


        const code =
            getCardCode(card);



        files.push(

            new AttachmentBuilder(

                getCardPath(card),

                {
                    name:
                    `${code}.png`
                }

            )

        );



        playerImages.push(

            `attachment://${code}.png`

        );


    }





    // DEALER CARDS

    if (revealDealer) {


        for (const card of game.dealer) {


            const code =
                getCardCode(card);



            files.push(

                new AttachmentBuilder(

                    getCardPath(card),

                    {
                        name:
                        `${code}.png`
                    }

                )

            );



            dealerImages.push(

                `attachment://${code}.png`

            );


        }


    } else {


        files.push(

            new AttachmentBuilder(

                path.join(

                    process.cwd(),

                    "assets",

                    "blackjack",

                    "BACK.png"

                ),

                {
                    name:
                    "BACK.png"
                }

            )

        );



        dealerImages.push(

            "attachment://BACK.png"

        );



        const second =
            getCardCode(
                game.dealer[1]
            );



        files.push(

            new AttachmentBuilder(

                getCardPath(
                    game.dealer[1]
                ),

                {
                    name:
                    `${second}.png`
                }

            )

        );



        dealerImages.push(

            `attachment://${second}.png`

        );

    }





    const embed =
        new EmbedBuilder()

        .setColor("#075e28")

        .setTitle(
            "🃏 Blackjack"
        )

        .addFields(

            {
                name:
                "Dealer",

                value:
                dealerImages.join(" ")
            },


            {
                name:
                "Player",

                value:
                playerImages.join(" ")
            }

        )

        .setFooter({

            text:
            `Bet: ${game.bet} Points`

        });



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
