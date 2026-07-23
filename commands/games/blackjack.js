const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");


const blackjackGames = require("../../games/blackjackManager");


const {
    randomCard,
    handValue,
    isBlackjack,
    isBust,
    dealerPlay,
    getResult
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
                "❌ Enter a valid bet amount."
            );

        }



        const canPlay =
            await balanceService.hasBalance(
                message.author.id,
                bet
            );



        if (!canPlay) {

            return message.reply(
                "❌ You don't have enough balance."
            );

        }



        await balanceService.removeBalance(
            message.author.id,
            bet,
            "blackjack_bet"
        );



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

            finished:false,

            insurance:false

        };



        if (isBlackjack(player)) {

            await balanceService.addBalance(
                message.author.id,
                bet * 2,
                "blackjack_win"
            );


            game.finished = true;


            const embed =
                gameEmbed(
                    game,
                    true
                );


            return message.reply({

                content:
                "🃏 **BLACKJACK! You win!**\n💰 Payout: **" 
                + (bet * 2) + " Points**",


                ...embed

            });

        }



        const msg =
        await message.reply({

            content:
            `🃏 **Blackjack Started**\nBet: **${bet} Points**`,


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

                    .setStyle(ButtonStyle.Danger),



                    new ButtonBuilder()

                    .setCustomId("bj_insurance")

                    .setLabel("Insurance")

                    .setStyle(ButtonStyle.Secondary)

                )

            ]

        });



        blackjackGames.set(

            msg.id,

            game

        );


    }

};
// CONTINUE FROM PART 1


// (inside the same blackjack.js file)
// No extra module needed here.
// Part 3 will finish the file.


async function finishGame(
    interaction,
    game
) {


    dealerPlay(
        game.dealer
    );


    game.finished = true;



    const result =
        getResult(
            game.player,
            game.dealer
        );



    let content = "";



    if (result === "win") {


        const payout =
            game.bet * 2;



        await balanceService.addBalance(

            game.userId,

            payout,

            "blackjack_win"

        );



        content =
        `🎉 **You Win!**\n💰 Payout: **${payout} Points**`;


    }



    else if (result === "push") {


        await balanceService.addBalance(

            game.userId,

            game.bet,

            "blackjack_push"

        );


        content =
        `🤝 **Push!**\n💰 Bet refunded: **${game.bet} Points**`;


    }



    else {


        content =
        "💀 **Dealer Wins!**";


    }



    blackjackGames.delete(

        interaction.message.id

    );



    return interaction.update({

        content,


        ...gameEmbed(

            game,

            true

        ),


        components:[]

    });


}



module.exports.finishGame = finishGame;
