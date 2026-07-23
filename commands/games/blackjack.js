const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");

const blackjackGames = require("../../games/blackjackManager");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");


const suits = ["C", "D", "H", "S"];

const values = [
    "A",
    "2","3","4","5","6","7","8","9","10",
    "J","Q","K"
];


function randomCard(){

    return {
        suit: suits[Math.floor(Math.random()*suits.length)],
        value: values[Math.floor(Math.random()*values.length)]
    };

}


function drawCardName(card){

    if(!card || !card.suit || !card.value){
        console.log("INVALID CARD:", card);
        return "invalid";
    }

    return `${card.suit}${card.value}`;

}



async function loadCard(file){

    const location = path.join(
        process.cwd(),
        "assets",
        "blackjack",
        file
    );


    if(!fs.existsSync(location)){

        console.log("Missing card image:", location);

        return null;
    }


    return await loadImage(location);

}



async function createBlackjackImage(player=[], dealer=[]){


    const canvas = createCanvas(1200,700);

    const ctx = canvas.getContext("2d");


    ctx.fillStyle="#111827";
    ctx.fillRect(0,0,1200,700);



    ctx.fillStyle="white";
    ctx.font="40px Arial";


    ctx.fillText(
        "Dealer",
        80,
        70
    );


    ctx.fillText(
        "Player",
        80,
        370
    );



    let x=80;



    for(let i=0;i<dealer.length;i++){


        let filename;


        if(i===0){

            filename="card-back.png";

        }
        else{

            filename=`${drawCardName(dealer[i])}.png`;

        }



        const img = await loadCard(filename);



        if(img){

            ctx.drawImage(
                img,
                x,
                100,
                130,
                180
            );

        }



        x+=150;

    }




    x=80;


    for(const card of player){


        const filename =
            `${drawCardName(card)}.png`;



        const img =
            await loadCard(filename);



        if(img){

            ctx.drawImage(
                img,
                x,
                400,
                130,
                180
            );

        }


        x+=150;

    }



    return canvas.toBuffer();

}





module.exports={


name:"blackjack",

aliases:["bj"],



async execute(message,args){


    const bet=Number(args[0]);



    if(!bet || bet<=0){

        return message.reply(
            "❌ Enter a valid bet."
        );

    }



    const player=[
        randomCard(),
        randomCard()
    ];


    const dealer=[
        randomCard(),
        randomCard()
    ];



    console.log(
        "PLAYER:",
        player
    );

    console.log(
        "DEALER:",
        dealer
    );



    const image =
        await createBlackjackImage(
            player,
            dealer
        );



    const msg =
    await message.reply({

        content:
        `🃏 **Blackjack**\nBet: **${bet} Points**`,


        files:[
            new AttachmentBuilder(
                image,
                {
                    name:"blackjack.png"
                }
            )
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

            userId:message.author.id,

            bet,

            player,

            dealer

        }

    );

}

};
