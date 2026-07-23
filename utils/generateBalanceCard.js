const { createCanvas, loadImage } = require("@napi-rs/canvas");
const path = require("path");

async function generateBalanceCard(user, data) {

    const canvas = createCanvas(1600, 900);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage(
        path.join(__dirname, "../assets/cards/balance.png")
    );

    ctx.drawImage(bg, 0, 0, 1600, 900);

    const avatar = await loadImage(
        user.displayAvatarURL({
            extension: "png",
            size: 512
        })
    );

    ctx.save();

    ctx.beginPath();

    ctx.arc(175, 175, 70, 0, Math.PI * 2);

    ctx.closePath();

    ctx.clip();

    ctx.drawImage(
        avatar,
        105,
        105,
        140,
        140
    );

    ctx.restore();

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
        `${Number(data.balance).toLocaleString()} Points`,
        450,
        360
    );

    ctx.fillStyle = "#ffffff";

    ctx.font = "40px Arial";

    ctx.fillText(
        `Vault: ${Number(data.vault).toLocaleString()}`,
        170,
        720
    );

    ctx.fillText(
        `Wagered: ${Number(data.wagered).toLocaleString()}`,
        650,
        720
    );

    ctx.fillText(
        `Level: ${data.level}`,
        1250,
        720
    );

    return canvas.encode("png");
}

module.exports = generateBalanceCard;
