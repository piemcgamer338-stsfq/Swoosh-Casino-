const blackjackGames = require("../games/blackjackManager");

const {
    randomCard,
    handValue,
    isBust
} = require("../utils/blackjackLogic");

const {
    gameEmbed
} = require("../utils/blackjackRenderer");

module.exports = {

    customId: "bj_hit",

    async execute(interaction) {

        const game = blackjackGames.get(
            interaction.message.id
        );

        if (!game)
            return interaction.reply({
                content: "❌ Game not found.",
                ephemeral: true
            });

        if (interaction.user.id !== game.userId)
            return interaction.reply({
                content: "❌ This isn't your game.",
                ephemeral: true
            });

        if (game.finished)
            return interaction.reply({
                content: "❌ Game already finished.",
                ephemeral: true
            });

        game.player.push(
            randomCard()
        );

        if (isBust(game.player)) {

            game.finished = true;

            return interaction.update({

                content: "💥 **Bust! You Lose!**",

                ...gameEmbed(game, true),

                components: []

            });

        }

        blackjackGames.update(
            interaction.message.id,
            game
        );

        return interaction.update({

            ...gameEmbed(game, false),

            components: interaction.message.components

        });

    }

};
