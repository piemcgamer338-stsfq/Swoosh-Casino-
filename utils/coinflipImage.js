const { createCanvas, loadImage } = require("canvas");
const path = require("path");

async function createCoinflipImage({
    username,
    avatar,
    result,
    win,
    amount
}) {

    const templatePath = path.join(
        __dirname,
        "../assets/games/coinflip-template.png"
    );


    const image = await loadImage(templatePath);


    const canvas = createCanvas(
        image.width,
        image.height
    );


    const ctx = canvas.getContext("2d");


    // background template
    ctx.drawImage(
        image,
        0,
        0
    );


    // username
    ctx.font = "bold 45px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.fillText(
        username,
        canvas.width / 2,
        100
    );


    // result
    ctx.font = "bold 55px Arial";

    ctx.fillStyle =
        win
        ? "#00ff88"
        : "#ff4d4d";


    ctx.fillText(
        `LANDED ON ${result.toUpperCase()}`,
        canvas.width / 2,
        canvas.height - 100
    );


    // amount
    ctx.font = "bold 35px Arial";
    ctx.fillStyle = "white";


    ctx.fillText(
        win
        ? `+${amount}`
        : `-${amount}`,
        canvas.width / 2,
        canvas.height - 50
    );


    return canvas.toBuffer();

}


module.exports = {
    createCoinflipImage
};
