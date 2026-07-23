const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const balanceService = require("../../services/balanceService");
const gameResultService = require("../../services/gameResultService");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const path = require("path");
const fs = require("fs");


function randomCard() {

    const suits = ["C", "D", "H", "S"];
    const values = [
        "A",
        "2","3","4","5","6","7","8","9","10",
        "J","Q","K"
    ];

    const suit =
        suits[Math.floor(Math.random() * suits.length)];

    const value =
        values[Math.floor(Math.random() * values.length)];


    return {
        name: `${suit}${value}`,
        value,
        suit
    };
}



function cardValue(card) {

    if (["J","Q","K"].includes(card.value))
        return 10;

    if (card.value === "A")
        return 11;

    return Number(card.value);

}



function calculateHand(cards) {

    let total = cards.reduce(
        (sum, card)=>sum + cardValue(card),
        0
    );


    let aces = cards.filter(
        c=>c.value==="A"
    ).length;


    while(total > 21 && aces > 0){
        total -= 10;
        aces--;
    }


    return total;

}



async function createBlackjackImage(player, dealer, hideDealer = true){

    const canvas = createCanvas(1200,700);
    const ctx = canvas.getContext("2d");


    ctx.fillStyle = "#111827";
    ctx.fillRect(0,0,1200,700);


    ctx.fillStyle="#ffffff";
    ctx.font="40px Arial";


    ctx.fillText(
        "Dealer",
        100,
        80
    );


    ctx.fillText(
        "Player",
        100,
        380
    );


    let x = 100;


    for(const card of dealer){

        let file =
        hideDealer && x !== 100
        ? "card-back.png"
        : `${card.name}.png`;


        const img =
        await loadImage(
            fs.readFileSync(
                path.join(
                    process.cwd(),
                    "assets",
                    "blackjack",
                    file
                )
            )
        );


        ctx.drawImage(
            img,
            x,
            100,
            120,
            170
        );


        x += 140;

    }



    x = 100;


    for(const card of player){

        const img =
        await loadImage(
            fs.readFileSync(
                path.join(
                    process.cwd(),
                    "assets",
                    "blackjack",
                    `${card.name}.png`
                )
            )
        );


        ctx.drawImage(
            img,
            x,
            400,
            120,
            170
        );


        x += 140;

    }


    return canvas.toBuffer("image/png");

}



module.exports = {

    name:"blackjack",

    aliases:["bj"],


    async execute(message,args){


        const bet =
        Number(args[0]);


        if(!bet || bet <= 0)
            return message.reply(
                "❌ Enter a valid bet."
            );


        const can =
        await balanceService.hasBalance(
            message.author.id,
            bet
        );


        if(!can)
            return message.reply(
                "❌ Not enough balance."
            );



        const player=[
            randomCard(),
            randomCard()
        ];


        const dealer=[
            randomCard(),
            randomCard()
        ];



        const image =
        await createBlackjackImage(
            player,
            dealer
        );



        const buttons =
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

        );



        return message.reply({

            content:
            `🃏 **Blackjack**\nBet: ${bet} Points`,

            files:[
                {
                    attachment:image,
                    name:"blackjack.png"
                }
            ],

            components:[
                buttons
            ]

        });


    }

};
