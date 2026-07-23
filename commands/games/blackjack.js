const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const blackjackGames = require("../../games/blackjackManager");

const {
    randomCard,
    handValue,
    isBlackjack
} = require("../../utils/blackjackLogic");

const {
    gameEmbed
} = require("../../utils/blackjackRenderer");

module.exports = {

    name: "blackjack",

    aliases: ["bj"],

    async execute(message, args) {

        const bet = Number(args[0]);

        if (!bet || bet <= 0) {
            return message.reply("❌ Enter a valid bet.");
        }

        const player = [
            randomCard(),
            randomCard()
        ];

        const dealer = [
            randomCard(),
            randomCard()
        ];

        const game = {

            userId: message.author.id,

            bet,

            player,

            dealer,

            finished: false

        };

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("bj_hit")
                .setLabel("Hit")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("bj_stand")
                .setLabel("Stand")
                .setStyle(ButtonStyle.Danger)

        );

        const reply = await message.reply({

            ...gameEmbed(game, false),

            components: [row]

        });
                blackjackGames.create(reply.id, game);

        if (isBlackjack(player)) {

            game.finished = true;

            return reply.edit({

                ...gameEmbed(game, true),

                content: "🎉 **BLACKJACK! You win!**",

                components: []

            });

        }

    }

};
