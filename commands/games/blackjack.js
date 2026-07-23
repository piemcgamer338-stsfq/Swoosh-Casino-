const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");

const blackjackGames = require("../../games/blackjackManager");


function randomCard() {

    const suits = ["♣", "♦", "♥", "♠"];

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


function cardName(card) {
    return `${card.value}${card.suit}`;
}


module.exports = {

    name: "blackjack",

    aliases: ["bj"],


    async execute(message,args){

        const bet = Number(args[0]);


        if(!bet || bet <= 0){
            return message.reply("❌ Enter a valid bet.");
        }


        const player = [
            randomCard(),
            randomCard()
        ];


        const dealer = [
            randomCard(),
            randomCard()
        ];



        const attachment = new AttachmentBuilder(
            "./assets/blackjack/table.png",
            {
                name:"blackjack-table.png"
            }
        );


        const embed = new EmbedBuilder()

        .setColor("#00b894")

        .setTitle("🃏 Blackjack")

        .setDescription(
`
**💰 Bet:** ${bet} Points


**🎩 Dealer Cards**
\`\`\`
${cardName(dealer[0])}  ${cardName(dealer[1])}
\`\`\`


**👤 Your Cards**
\`\`\`
${cardName(player[0])}  ${cardName(player[1])}
\`\`\`


Choose your move:
`
)

        .setImage("attachment://blackjack-table.png")

        .setFooter({
            text:"Swoosh Bet Blackjack"
        });



        const msg = await message.reply({

            embeds:[
                embed
            ],

            files:[
                attachment
            ],


            components:[

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
