// utils/blackjackRenderer.js

const {
    EmbedBuilder,
    AttachmentBuilder
} = require("discord.js");

const path = require("path");


function getCardName(card) {

    if (typeof card === "string") {
        return card;
    }


    if (card.name) {
        return card.name;
    }


    if (card.code) {
        return card.code;
    }


    if (card.rank && card.suit) {

        return `${card.suit}${card.rank}`;

    }


    return "UNKNOWN";

}



function cardPath(card) {

    const name = getCardName(card);

    return path.join(
        process.cwd(),
        "assets",
        "blackjack",
        `${name}.png`
    );

}



function gameEmbed(game, revealDealer = false) {


    const files = [];

    const playerCards = [];
    const dealerCards = [];



    for (const card of game.player) {

        const name = getCardName(card);


        files.push(
            new AttachmentBuilder(
                cardPath(card),
                {
                    name:`${name}.png`
                }
            )
        );


        playerCards.push(
            `attachment://${name}.png`
        );

    }



    if (revealDealer) {


        for (const card of game.dealer) {

            const name = getCardName(card);


            files.push(
                new AttachmentBuilder(
                    cardPath(card),
                    {
                        name:`${name}.png`
                    }
                )
            );


            dealerCards.push(
                `attachment://${name}.png`
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
                    name:"BACK.png"
                }

            )

        );


        dealerCards.push(
            "attachment://BACK.png"
        );



        const second =
        getCardName(game.dealer[1]);


        files.push(

            new AttachmentBuilder(
                cardPath(game.dealer[1]),
                {
                    name:`${second}.png`
                }
            )

        );


        dealerCards.push(
            `attachment://${second}.png`
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
                dealerCards.join("\n")

            },


            {
                name:"Player",

                value:
                playerCards.join("\n")

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
