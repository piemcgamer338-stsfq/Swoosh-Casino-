const {
    createCanvas
} = require("@napi-rs/canvas");

const {
    AttachmentBuilder
} = require("discord.js");


async function createLimboImage(data){


    console.log("🔥 LIMBO RENDERER RUNNING");


    const canvas =
        createCanvas(1200,630);


    const ctx =
        canvas.getContext("2d");



    // Background

    ctx.fillStyle = "#050505";

    ctx.fillRect(
        0,
        0,
        1200,
        630
    );



    // Title

    ctx.fillStyle = "#ffffff";

    ctx.font =
        "bold 70px Arial";


    ctx.fillText(
        "🚀 LIMBO",
        80,
        100
    );



    ctx.font =
        "bold 45px Arial";


    ctx.fillText(
        `💰 Bet: ${data.bet} Points`,
        100,
        230
    );


    ctx.fillText(
        `🎯 Target: ${data.target}x`,
        100,
        300
    );


    ctx.fillText(
        `💥 Crashed at: ${data.crash}x`,
        100,
        370
    );




    ctx.font =
        "bold 65px Arial";



    if(data.win){


        ctx.fillStyle =
            "#00ff88";


        ctx.fillText(
            "🏆 YOU WON",
            100,
            500
        );


    } else {


        ctx.fillStyle =
            "#ff3333";


        ctx.fillText(
            "💀 YOU LOST",
            100,
            500
        );

    }




    return new AttachmentBuilder(

        canvas.toBuffer("image/png"),

        {
            name:
            "limbo-result.png"
        }

    );

}



module.exports = {
    createLimboImage
};
