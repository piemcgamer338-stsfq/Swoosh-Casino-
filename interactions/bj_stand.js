const blackjackGames = require("../games/blackjackManager");

module.exports = {

    customId: "bj_stand",

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

        await interaction.reply({
            content:
            `🛑 You stood.\n\nYour cards:\n${game.player.map(c=>`${c.value}${c.suit}`).join(" ")}`
        });

    }

};
