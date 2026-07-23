const { createCanvas, loadImage } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");

console.log("🔥 USING NEW BALANCE GENERATOR FILE");

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

    ctx.drawImage(bg, 0, 0, 1600, 900);


    // TEST TEXT
    ctx.fillStyle = "red";
    ctx.font = "bold 80px Arial";

    ctx.fillText(
        "TEST BALANCE CARD",
        100,
        100
    );


    ctx.fillStyle = "white";
    ctx.font = "bold 50px Arial";

    ctx.fillText(
        `User: ${user.username}`,
        100,
        250
    );

    ctx.fillText(
        `Balance: ${data.balance}`,
        100,
        350
    );

    ctx.fillText(
        `Vault: ${data.vault}`,
        100,
        450
    );

    ctx.fillText(
        `Wagered: ${data.wagered}`,
        100,
        550
    );

    ctx.fillText(
        `Level: ${data.level}`,
        100,
        650
    );

    ctx.fillText(
        `XP: ${data.xp}`,
        100,
        750
    );


    console.log("BALANCE CARD GENERATED");
    
    return canvas.toBuffer("image/png");
}

module.exports = generateBalanceCard;
