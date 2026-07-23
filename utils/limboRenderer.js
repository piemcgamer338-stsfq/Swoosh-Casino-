const {
    createCanvas
} = require("@napi-rs/canvas");

const {
    AttachmentBuilder
} = require("discord.js");


async function createLimboImage(data) {


    console.log("🔥 LIMBO RENDERER RUNNING");


    const canvas = createCanvas(1200, 630);

    const ctx = canvas.getContext("2d");



    // background

    ctx.fillStyle = "#111111";

    ctx.fillRect(
        0,
        0,
        1200,
        630
    );



    // big visible test area

    ctx.fillStyle = "#ff0000";

    ctx.fillRect(
        50,
        50,
        1100,
        200
    );



    // text

    ctx.fillStyle = "#ffffff";

    ctx.font = "70px Arial";


    ctx.fillText(
        "LIMBO RESULT",
        100,
        150
    );



    ctx.font = "50px Arial";


    ctx.fillText(
        "CRASH: " + String(data.crash),
        100,
        350
    );


    ctx.fillText(
        "BET: " + String(data.bet),
        100,
        430
    );


    ctx.fillText(
        "TARGET: " + String(data.target),
        100,
        510
    );



    const buffer =
        canvas.toBuffer("image/png");



    return new AttachmentBuilder(
        buffer,
        {
            name: "limbo-test.png"
        }
    );

}


module.exports = {
    createLimboImage
};
