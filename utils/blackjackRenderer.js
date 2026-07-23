const {
    EmbedBuilder,
    AttachmentBuilder
} = require("discord.js");

const { createCanvas } = require("@napi-rs/canvas");
const { handValue } = require("./blackjackLogic");

function cardText(card) {
    return `${card.value}${card.suit}`;
}

function tableImage() {

    const canvas = createCanvas(1200, 700);
    const ctx = canvas.getContext("2d");

    // Table
    ctx.fillStyle = "#0c4d1f";
    ctx.fillRect(0, 0, 1200, 700);

    // Border
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 1160, 660);

    // Dealer zone
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("DEALER", 70, 80);

    // Player zone
    ctx.fillText("PLAYER", 70, 400);

    return new AttachmentBuilder(
        canvas.toBuffer("image/png"),
        {
            name: "blackjack.png"
        }
    );

}

function gameEmbed(game, revealDealer = false) {

    const dealerCards = revealDealer
        ? game.dealer.map(cardText).join(" ")
        : `?? ${cardText(game.dealer[1])}`;

    const playerCards =
        game.player.map(cardText).join(" ");

    const dealerValue =
        revealDealer
            ? handValue(game.dealer)
            : "?";

    const playerValue =
        handValue(game.player);

    const embed = new EmbedBuilder()
        .setColor("#2ecc71")
        .setTitle("🃏 Blackjack")
        .setDescription(
`## Bet
💰 **${game.bet}**

### Dealer
Cards: ${dealerCards}
Value: ${dealerValue}

### Player
Cards: ${playerCards}
Value: ${playerValue}`
        )
        .setImage("attachment://blackjack.png");

    return {
        embeds: [embed],
        files: [tableImage()]
    };

}

module.exports = {
    gameEmbed
};
