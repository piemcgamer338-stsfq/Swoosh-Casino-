const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const blackjackGames = require("../../games/blackjackManager");


function randomCard() {

    const suits = [
        "♣",
        "♦",
        "♥",
        "♠"
    ];

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
        value: values[Math.floor(Math.random() * values.length)],
        suit: suits[Math.floor(Math.random() * suits.length)]
    };

}



function showCards(cards) {

    if (!Array.isArray(cards)) return "";

    return cards
        .map(c => `${c.value}${c.suit}`)
        .join("  ");

}



module.exports = {

    name: "blackjack",

    aliases: [
        "bj"
    ],


    async execute(message, args) {


        const bet = Number(args[0]);


        if (!bet || bet <= 0) {

            return message.reply(
                "❌ Enter a valid bet."
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



        const msg = await message.reply({

            content:
`🃏 **Blackjack**

💰 Bet: **${bet} Points**

🎩 Dealer:
\`${showCards(dealer)}\`

👤 Player:
\`${showCards(player)}\`
`,

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
                bet: bet,
                player: player,
                dealer: dealer
            }

        );


    }

};
