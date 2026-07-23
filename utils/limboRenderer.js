const {
    createCanvas
} = require("@napi-rs/canvas");

const {
    AttachmentBuilder
} = require("discord.js");


async function createLimboImage(data) {


    console.log("🔥 LIMBO IMAGE CREATED");


    const canvas =
        createCanvas(1200, 630);


    const ctx =
        canvas.getContext("2d");



    // background

    ctx.fillStyle = "#111111";

    ctx.fillRect(
        0,
        0,
        1200,
        630
    );



    // BIG BOX TEST

    ctx.fillStyle = "#ff0000";

    ctx.fillRect(
        50,
        50,
        1100,
        150
    );



    // TEXT

    ctx.fillStyle = "#ffffff";

    ctx.font =
        "bold 70px Arial";


    ctx.fillText(
        "LIMBO RESULT",
        100,
        150
    );



    ctx.font =
        "bold 50px Arial";


    ctx.fillText(
        "CRASHED AT: " + data.crash + "x",
        100,
        300
    );


    ctx.fillText(
        "BET: " + data.bet,
        100,
        380
    );


    ctx.fillText(
        "TARGET: " + data.target + "x",
        100,
        460
    );



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
