const blackjackGames = require("../games/blackjackManager");

const {
    handValue
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

        const suits = ["♠","♥","♦","♣"];
        const values = [
            "A","2","3","4","5","6","7",
            "8","9","10","J","Q","K"
        ];

        game.player.push({

            suit: suits[
                Math.floor(
                    Math.random() * suits.length
                )
            ],

            value: values[
                Math.floor(
                    Math.random() * values.length
                )
            ]

        });

        if (handValue(game.player) > 21) {

            game.finished = true;

            blackjackGames.delete(
                interaction.message.id
            );

            return interaction.update({

                content: "💀 **Bust! Dealer Wins!**",

                ...gameEmbed(
                    game,
                    true
                ),

                components: []

            });

        }

        return interaction.update({

            ...gameEmbed(
                game,
                false
            )

        });

    }

};
