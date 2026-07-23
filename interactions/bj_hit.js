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


        const game =
            blackjackGames.get(
                interaction.message.id
            );


        if (!game) {

            return interaction.reply({
                content: "❌ Game not found.",
                ephemeral: true
            });

        }



        if (
            interaction.user.id !== game.userId
        ) {

            return interaction.reply({
                content: "❌ This is not your game.",
                ephemeral: true
            });

        }



        if (game.finished) {

            return interaction.reply({
                content: "❌ Game already finished.",
                ephemeral: true
            });

        }



        game.player.push(
            randomCard()
        );



        const value =
            handValue(
                game.player
            );



        if (isBust(game.player)) {


            game.finished = true;


            blackjackGames.delete(
                interaction.message.id
            );


            return interaction.update({

                content:
                `💀 **Bust! You lose!**\nYour total: **${value}**`,


                ...gameEmbed(
                    game,
                    true
                ),


                components: []

            });


        }



        return interaction.update({

            content:
            `🃏 **Blackjack**\nBet: **${game.bet} Points**`,


            ...gameEmbed(
                game,
                false
            )


        });


    }

};
