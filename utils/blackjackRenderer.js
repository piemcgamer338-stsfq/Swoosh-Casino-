const {
    EmbedBuilder
} = require("discord.js");


function cardText(card){

    if(!card) return "?";

    return `${card.value}${card.suit}`;

}



function gameEmbed(
    game,
    revealDealer = false
){


    const player =
        game.player
        .map(cardText)
        .join(" ");



    let dealer;



    if(revealDealer){

        dealer =
        game.dealer
        .map(cardText)
        .join(" ");

    }
    else{

        dealer =
        `${cardText(game.dealer[0])} 🂠`;

    }



    const embed =
    new EmbedBuilder()

    .setColor("#008000")

    .setTitle("🃏 Blackjack")

    .setDescription(
`
💰 Bet: **${game.bet} Points**

**Dealer**
${dealer}

**Player**
${player}
`
    );



    return {
        embeds:[
            embed
        ]
    };


}



module.exports = {
    gameEmbed
};
