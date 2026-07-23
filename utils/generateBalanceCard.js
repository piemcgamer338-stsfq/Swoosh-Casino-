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


    const bg = await loadImage(
        fs.readFileSync(bgPath)
    );


    ctx.drawImage(
        bg,
        0,
        0,
        1600,
        900
    );


    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 6;


    // Username
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 55px Arial";

    ctx.fillText(
        user.username,
        250,
        150
    );


    // Balance (main)
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 90px Arial";

    ctx.fillText(
        `${Number(data.balance || 0).toLocaleString()} Points`,
        250,
        300
    );


    // Smaller information
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 45px Arial";


    ctx.fillText(
        `Vault: ${Number(data.vault || 0).toLocaleString()}`,
        250,
        470
    );


    ctx.fillText(
        `Wagered: ${Number(data.wagered || 0).toLocaleString()}`,
        250,
        550
    );


    ctx.fillText(
        `Level: ${Number(data.level || 1)}`,
        900,
        470
    );


    ctx.fillText(
        `XP: ${Number(data.xp || 0).toLocaleString()}`,
        900,
        550
    );


    ctx.shadowBlur = 0;


    return canvas.toBuffer("image/png");

}


module.exports = generateBalanceCard;
