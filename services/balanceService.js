const blackjackGames = require("../games/blackjackManager");

const {
    dealerPlay,
    getResult
} = require("../utils/blackjackLogic");

const {
    gameEmbed
} = require("../utils/blackjackRenderer");

const balanceService = require("../services/balanceService");

module.exports = {

    customId: "bj_stand",

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

        dealerPlay(game.dealer);

        game.finished = true;

        const result = getResult(
            game.player,
            game.dealer
        );

        let text = "";

        if (result === "win") {

            text = `🎉 **You Won!** (+${game.bet}$)`;

            await balanceService.addBalance(
                game.userId,
                game.bet,
                "blackjack_win"
            );

        }

        else if (result === "lose") {

            text = `💀 **Dealer Wins!** (-${game.bet}$)`;

            await balanceService.removeBalance(
                game.userId,
                game.bet,
                "blackjack_loss"
            );

        }

        else {

            text = "🤝 **Push!**";

        }

        blackjackGames.delete(
            interaction.message.id
        );

        await interaction.update({

            content: text,

            ...gameEmbed(
                game,
                true
            ),

            components: []

        });

    }

};
