const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const blackjackGames = require("../../games/blackjackManager");

const {
    randomCard,
    isBlackjack
} = require("../../utils/blackjackLogic");

const {
    gameEmbed
} = require("../../utils/blackjackRenderer");

const balanceService = require("../../services/balanceService");


module.exports = {

    name: "blackjack",

    aliases: ["bj"],


    async execute(message, args) {


        const bet = Number(args[0]);


        if (!bet || bet <= 0) {
            return message.reply(
                "❌ Enter a valid bet."
            );
        }



        const hasMoney =
            await balanceService.hasBalance(
                message.author.id,
                bet
            );


        if (!hasMoney) {

            return message.reply(
                "❌ You don't have enough balance."
            );

        }



        await balanceService.removeBalance(
            message.author.id,
            bet,
            "blackjack_bet"
        );



        const game = {

            userId: message.author.id,

            bet,

            player: [
                randomCard(),
                randomCard()
            ],

            dealer: [
                randomCard(),
                randomCard()
            ],

            finished:false

        };



        if (isBlackjack(game.player)) {


            await balanceService.addBalance(
                message.author.id,
                bet * 2,
                "blackjack_blackjack"
            );


            return message.reply({

                content:
                `🃏 **BLACKJACK!**\n💰 Won: **${bet * 2} Points**`,

                ...gameEmbed(
                    game,
                    true
                )

            });


        }



        const msg =
        await message.reply({

            content:
            `🃏 **Blackjack Started**\n💰 Bet: **${bet} Points**`,

            ...gameEmbed(
                game,
                false
            ),


            components:[

                new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()
                    .setCustomId("bj_hit")
                    .setLabel("Hit")
                    .setStyle(ButtonStyle.Success),


                    new ButtonBuilder()
                    .setCustomId("bj_stand")
                    .setLabel("Stand")
                    .setStyle(ButtonStyle.Danger)

                )

            ]

        });



        blackjackGames.set(

            msg.id,

            game

        );


    }

};
