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



    // RED TEST BACKGROUND

    ctx.fillStyle = "red";

    ctx.fillRect(
        0,
        0,
        1200,
        630
    );



    ctx.fillStyle="white";

    ctx.font="bold 80px Arial";


    ctx.fillText(
        "CRASHED AT "+data.crash+"x",
        100,
        200
    );


    ctx.font="bold 50px Arial";


    ctx.fillText(
        "BET "+data.bet,
        100,
        300
    );


    return new AttachmentBuilder(

        canvas.toBuffer("png"),

        {
            name:
            "NEW-limbo-result.png"
        }

    );


}


module.exports={
    createLimboImage
};
