const {
    createCanvas,
    loadImage
} = require("@napi-rs/canvas");

const {
    AttachmentBuilder
} = require("discord.js");

const path = require("path");


async function createLimboImage(data){


    const canvas =
        createCanvas(1200,630);


    const ctx =
        canvas.getContext("2d");



    const imagePath =
        path.join(
            process.cwd(),
            "assets",
            "limbo.png"
        );


    console.log(
        "Loading image:",
        imagePath
    );



    const img =
        await loadImage(imagePath);



    ctx.drawImage(
        img,
        0,
        0,
        1200,
        630
    );



    // TEST TEXT

    ctx.fillStyle="#ffffff";

    ctx.font="bold 60px Arial";


    ctx.fillText(
        "CRASHED AT "+data.crash+"x",
        100,
        120
    );


    ctx.font="bold 45px Arial";


    ctx.fillText(
        "BET: "+data.bet,
        100,
        200
    );


    ctx.fillText(
        "TARGET: "+data.target+"x",
        100,
        270
    );



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
