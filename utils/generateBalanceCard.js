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


    // Text shadow
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 8;


    // Username
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 55px Arial";

    ctx.fillText(
        user.username,
        250,
        160
    );


    // Main Balance
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 90px Arial";

    ctx.fillText(
        `${Number(data.balance || 0).toLocaleString()} Points`,
        250,
        300
    );


    // Stats
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 45px Arial";


    ctx.fillText(
        `💰 Balance: ${Number(data.balance || 0).toLocaleString()}`,
        180,
        470
    );


    ctx.fillText(
        `🏦 Vault: ${Number(data.vault || 0).toLocaleString()}`,
        180,
        550
    );


    ctx.fillText(
        `🎲 Wagered: ${Number(data.wagered || 0).toLocaleString()}`,
        180,
        630
    );


    ctx.fillText(
        `🏆 Won: ${Number(data.won || 0).toLocaleString()}`,
        850,
        470
    );


    ctx.fillText(
        `📉 Lost: ${Number(data.lost || 0).toLocaleString()}`,
        850,
        550
    );


    ctx.fillText(
        `⭐ Level: ${Number(data.level || 1)}`,
        850,
        630
    );


    ctx.fillText(
        `✨ XP: ${Number(data.xp || 0).toLocaleString()}`,
        850,
        710
    );


    ctx.shadowBlur = 0;


    return canvas.toBuffer("image/png");

}


module.exports = generateBalanceCard;
