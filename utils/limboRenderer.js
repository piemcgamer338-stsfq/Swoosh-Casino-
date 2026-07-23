const {
    createCanvas,
    GlobalFonts
} = require("@napi-rs/canvas");

const {
    AttachmentBuilder
} = require("discord.js");


// Register default font
GlobalFonts.registerFromPath(
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "DejaVu"
);


async function createLimboImage(data) {


    const canvas =
        createCanvas(1200,630);


    const ctx =
        canvas.getContext("2d");



    ctx.fillStyle = "#111111";

    ctx.fillRect(
        0,
        0,
        1200,
        630
    );



    ctx.fillStyle = "#00ff88";

    ctx.font =
        "bold 80px DejaVu";

    ctx.fillText(
        "LIMBO RESULT",
        100,
        150
    );



    ctx.fillStyle = "#ffffff";

    ctx.font =
        "bold 55px DejaVu";


    ctx.fillText(
        `CRASHED AT ${data.crash}x`,
        100,
        280
    );


    ctx.fillText(
        `BET ${data.bet}`,
        100,
        380
    );


    ctx.fillText(
        `TARGET ${data.target}x`,
        100,
        480
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
