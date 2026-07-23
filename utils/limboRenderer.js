const { createCanvas } = require("@napi-rs/canvas");
const { AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");


async function createLimboImage(data) {


    const width = 1200;
    const height = 600;


    const canvas = createCanvas(
        width,
        height
    );


    const ctx = canvas.getContext("2d");



    // Background

    ctx.fillStyle = "#050816";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );



    // Glow

    const gradient =
        ctx.createRadialGradient(
            600,
            250,
            20,
            600,
            250,
            500
        );


    gradient.addColorStop(
        0,
        "#ff9d00"
    );

    gradient.addColorStop(
        1,
        "#050816"
    );


    ctx.fillStyle = gradient;


    ctx.fillRect(
        0,
        0,
        width,
        height
    );



    // Rocket

    ctx.font =
        "120px Arial";


    ctx.fillText(
        "🚀",
        540,
        250
    );



    // Title

    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 55px Arial";


    ctx.fillText(
        "🚀 LIMBO",
        70,
        90
    );



    // Info box

    ctx.fillStyle =
        "rgba(0,0,0,0.45)";


    ctx.roundRect(
        60,
        130,
        1080,
        350,
        25
    );


    ctx.fill();



    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 35px Arial";



    ctx.fillText(
        `💰 Bet: ${data.bet} Points`,
        120,
        220
    );



    ctx.fillText(
        `🎯 Target: ${data.target}x`,
        120,
        280
    );



    ctx.fillText(
        `💥 Crashed at: ${data.crash}x`,
        120,
        340
    );



    ctx.font =
        "bold 60px Arial";



    if(data.win){


        ctx.fillStyle =
            "#2ecc71";


        ctx.fillText(
            "🏆 YOU WON!",
            120,
            430
        );


        ctx.font =
            "bold 35px Arial";


        ctx.fillText(
            `Payout: ${data.payout} Points`,
            600,
            430
        );


    } else {


        ctx.fillStyle =
            "#e74c3c";


        ctx.fillText(
            "💀 YOU LOST",
            120,
            430
        );

    }



    return new AttachmentBuilder(

        canvas.toBuffer("image/png"),

        {
            name:"limbo-result.png"
        }

    );

}



module.exports = {
    createLimboImage
};
