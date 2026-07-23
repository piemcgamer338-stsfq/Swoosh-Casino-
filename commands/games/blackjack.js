const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");

const blackjackGames = require("../../games/blackjackManager");
const { createCanvas } = require("@napi-rs/canvas");


function randomCard() {

    const suits = ["C", "D", "H", "S"];

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



function formatCard(card) {

    if (!card) return "?";

    return `${card.value || "?"}${card.suit || ""}`;

}



function createBlackjackImage(player, dealer) {

    const canvas = createCanvas(1200, 700);
    const ctx = canvas.getContext("2d");


    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, 1200, 700);


    ctx.fillStyle = "#ffffff";


    ctx.font = "50px Arial";
    ctx.fillText("BLACKJACK", 60, 80);


    ctx.font = "35px Arial";

    ctx.fillText("Dealer", 60, 180);
    ctx.fillText("Player", 60, 430);


    ctx.font = "45px Arial";


    const dealerCards = dealer
        .map(formatCard)
        .join("  ");


    const playerCards = player
        .map(formatCard)
        .join("  ");


    ctx.fillText(
        String(dealerCards),
        80,
        260
    );


    ctx.fillText(
        String(playerCards),
        80,
        510
    );


    return canvas.toBuffer();

}



module.exports = {

    name: "blackjack",

    aliases: ["bj"],


    async execute(message, args) {


        const bet = Number(args[0]);


        if (!bet || bet <= 0) {

            return message.reply(
                "Enter a valid bet."
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



        const image = createBlackjackImage(
            player,
            dealer
        );



        const msg = await message.reply({

            content:
            `Blackjack\nBet: **${bet} Points**`,


            files: [
                new AttachmentBuilder(
                    image,
                    {
                        name: "blackjack.png"
                    }
                )
            ],


            components: [

                new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                    .setCustomId("bj_hit")
                    .setLabel("Hit")
                    .setStyle(ButtonStyle.Success),


                    new ButtonBuilder()
                    .setCustomId("bj_stand")
                    .setLabel("Stand")
                    .setStyle(ButtonStyle.Danger)

                )

            ]

        });



        blackjackGames.set(

            msg.id,

            {
                userId: message.author.id,
                bet,
                player,
                dealer
            }

        );


    }

};
