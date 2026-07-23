const { createCanvas, loadImage } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");


async function generateBalanceCard(user, data) {

    const canvas = createCanvas(1600, 900);
    const ctx = canvas.getContext("2d");


    const bgPath = path.join(
        process.cwd(),
        "assets",
        "cards",
        "balance.png"
    );


    if (!fs.existsSync(bgPath)) {
        throw new Error(
            `Balance image missing: ${bgPath}`
        );
    }


    const imageBuffer = fs.readFileSync(bgPath);


    console.log(
        "BALANCE IMAGE HEADER:",
        imageBuffer.slice(0, 20).toString()
    );


    const bg = await loadImage(imageBuffer);


    ctx.drawImage(
        bg,
        0,
        0,
        1600,
        900
    );


    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";

    ctx.fillText(
        user.username,
        280,
        170
    );


    ctx.fillStyle = "#FFD54F";
    ctx.font = "bold 82px Arial";

    ctx.fillText(
        `${Number(data.balance || 0).toLocaleString()} Points`,
        450,
        360
    );


    ctx.fillStyle = "#ffffff";
    ctx.font = "40px Arial";


    ctx.fillText(
        `Vault: ${Number(data.vault || 0).toLocaleString()}`,
        170,
        720
    );


    ctx.fillText(
        `Wagered: ${Number(data.wagered || 0).toLocaleString()}`,
        650,
        720
    );


    ctx.fillText(
        `Level: ${Number(data.level || 1)}`,
        1250,
        720
    );


    return canvas.toBuffer("image/png");

}


module.exports = generateBalanceCard;
