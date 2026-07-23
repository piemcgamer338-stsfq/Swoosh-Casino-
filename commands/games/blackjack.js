const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const blackjackGames = require("../../games/blackjackManager");
const balanceService = require("../../services/balanceService");

const {
    gameEmbed
} = require("../../utils/blackjackRenderer");

function randomCard() {

    const suits = ["♠","♥","♦","♣"];

    const values = [
        "A","2","3","4","5","6","7",
        "8","9","10","J","Q","K"
    ];

    return {
        suit: suits[Math.floor(Math.random()*suits.length)],
        value: values[Math.floor(Math.random()*values.length)]
    };

}

function cardValue(card){

    if(card.value === "A") return 11;

    if(
        card.value === "J" ||
        card.value === "Q" ||
        card.value === "K"
    ) return 10;

    return Number(card.value);

}

function handValue(hand){

    let total = 0;
    let aces = 0;

    for(const card of hand){

        total += cardValue(card);

        if(card.value === "A")
            aces++;

    }

    while(total > 21 && aces > 0){

        total -= 10;
        aces--;

    }

    return total;

}

function isBlackjack(hand){

    return hand.length === 2 &&
           handValue(hand) === 21;

}
module.exports = {

    name: "blackjack",

    aliases: ["bj"],

    async execute(message, args) {

        const bet = Number(args[0]);

        if (!bet || bet <= 0)
            return message.reply("❌ Enter a valid bet.");

        const hasMoney =
            await balanceService.hasBalance(
                message.author.id,
                bet
            );

        if (!hasMoney)
            return message.reply(
                "❌ You don't have enough balance."
            );

        await balanceService.removeBalance(
            message.author.id,
            bet,
            "blackjack_bet"
        );

        const player = [
            randomCard(),
            randomCard()
        ];

        const dealer = [
            randomCard(),
            randomCard()
        ];

        const game = {

            userId: message.author.id,

            bet,

            player,

            dealer,

            finished: false

        };

        let content = "";

        if (
            isBlackjack(player) &&
            isBlackjack(dealer)
        ) {

            game.finished = true;

            await balanceService.addBalance(
                message.author.id,
                bet,
                "blackjack_push"
            );

            content = "🤝 Push! Both have Blackjack.";

        }

        else if (isBlackjack(player)) {

            game.finished = true;

            await balanceService.addBalance(
                message.author.id,
                bet * 2,
                "blackjack_win"
            );

            content = "🎉 Blackjack! You win.";

        }

        else if (isBlackjack(dealer)) {

            game.finished = true;

            content = "💀 Dealer has Blackjack.";

        }
                const row = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("bj_hit")
                    .setLabel("Hit")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(game.finished),

                new ButtonBuilder()
                    .setCustomId("bj_stand")
                    .setLabel("Stand")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(game.finished)

            );

        const msg = await message.reply({

            content,

            ...gameEmbed(
                game,
                game.finished
            ),

            components: game.finished
                ? []
                : [row]

        });

        if (!game.finished) {

            blackjackGames.set(
                msg.id,
                game
            );

        }

    }

};
const balanceService = require("../../services/balanceService");

console.log(balanceService);
