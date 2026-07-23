const blackjackGames = require("../games/blackjackManager");

function randomCard() {
    const suits = ["♣","♦","♥","♠"];
    const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

    return {
        suit: suits[Math.floor(Math.random()*suits.length)],
        value: values[Math.floor(Math.random()*values.length)]
    };
}

module.exports = {

    customId: "bj_hit",

    async execute(interaction) {

        const game = blackjackGames.get(interaction.message.id);

        if (!game)
            return interaction.reply({
                content:"❌ Game expired.",
                ephemeral:true
            });

        if (interaction.user.id !== game.userId)
            return interaction.reply({
                content:"❌ This isn't your game.",
                ephemeral:true
            });

        const card = randomCard();

        game.player.push(card);

        await interaction.reply({
            content:`🃏 You drew **${card.value}${card.suit}**`
        });

    }

};
