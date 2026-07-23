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


const {
    hasBalance,
    removeBalance,
    addBalance
} = require("../../services/balanceService");



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



        const balance =
            await hasBalance(
                message.author.id,
                bet
            );



        if (!balance) {

            return message.reply(
                "❌ You don't have enough balance."
            );

        }



        await removeBalance(
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



        // Instant blackjack

        if (isBlackjack(game.player)) {


            const payout =
                bet * 2;



            await addBalance(

                message.author.id,

                payout,

                "blackjack_blackjack"

            );



            return message.reply({

                content:
                `🃏 **BLACKJACK!**\n💰 Won: **${payout} Points**`,


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

                    .setStyle(
                        ButtonStyle.Success
                    ),



                    new ButtonBuilder()

                    .setCustomId("bj_stand")

                    .setLabel("Stand")

                    .setStyle(
                        ButtonStyle.Danger
                    )


                )


            ]


        });



        blackjackGames.set(

            msg.id,

            game

        );


    }

};
