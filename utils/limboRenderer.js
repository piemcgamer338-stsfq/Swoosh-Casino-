const {
    createCanvas,
    loadImage
} = require("@napi-rs/canvas");

const {
    AttachmentBuilder
} = require("discord.js");

const path = require("path");


async function createLimboImage(data){


    const width = 1200;
    const height = 630;


    const canvas =
        createCanvas(width,height);


    const ctx =
        canvas.getContext("2d");



    // Load your background PNG

    const bg =
        await loadImage(
            path.join(
                __dirname,
                "../assets/limbo.png"
            )
        );


    ctx.drawImage(
        bg,
        0,
        0,
        width,
        height
    );



    // dark overlay

    ctx.fillStyle =
        "rgba(0,0,0,0.55)";


    ctx.fillRect(
        0,
        0,
        width,
        height
    );



    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 55px Arial";


    ctx.fillText(
        "🚀 LIMBO",
        80,
        100
    );



    ctx.font =
        "bold 35px Arial";


    ctx.fillText(
        `💰 Bet: ${data.bet} Points`,
        100,
        210
    );


    ctx.fillText(
        `🎯 Target: ${data.target}x`,
        100,
        270
    );


    ctx.fillText(
        `💥 Crashed at: ${data.crash}x`,
        100,
        340
    );



    ctx.font =
        "bold 60px Arial";


    if(data.win){

        ctx.fillStyle =
            "#00ff88";


        ctx.fillText(
            "🏆 YOU WON",
            100,
            450
        );


    }
    else{

        ctx.fillStyle =
            "#ff3333";


        ctx.fillText(
            "💀 YOU LOST",
            100,
            450
        );

    }



    return new AttachmentBuilder(

        canvas.toBuffer("image/png"),

        {
            name:"limbo-result.png"
        }

    );

}



module.exports={
    createLimboImage
};
