const {
    EmbedBuilder
} = require("discord.js");


const {
    hasBalance,
    removeBalance,
    addBalance
} = require("../../services/balanceService");



module.exports = {

    name: "ward",

    aliases: ["war"],


    async execute(message, args) {


        const bet = Number(args[0]);



        if (!bet || bet <= 0) {

            return message.reply(
                "❌ Enter a valid bet amount."
            );

        }



        const canPlay =
            await hasBalance(
                message.author.id,
                bet
            );



        if (!canPlay) {

            return message.reply(
                "❌ You don't have enough balance."
            );

        }



        await removeBalance(
            message.author.id,
            bet,
            "ward_bet"
        );



        const playerRoll =
            Math.floor(
                Math.random() * 6
            ) + 1;



        const dealerRoll =
            Math.floor(
                Math.random() * 6
            ) + 1;



        let result = "";
        let color = "#2ecc71";



        if (playerRoll > dealerRoll) {


            const payout =
                bet * 2;



            await addBalance(
                message.author.id,
                payout,
                "ward_win"
            );



            result =
            `🏆 **Player Wins!**\n💰 Won: **${payout} Points**`;



        } else if (dealerRoll > playerRoll) {



            color = "#e74c3c";


            result =
            `💀 **Dealer Wins!**\n💸 Lost: **${bet} Points**`;



        } else {



            await addBalance(
                message.author.id,
                bet,
                "ward_push"
            );



            color = "#f1c40f";


            result =
            `🤝 **Draw!**\n💰 Refund: **${bet} Points**`;

        }




        const embed =
            new EmbedBuilder()

            .setColor(color)

            .setTitle("⚔️ War Dice")

            .setDescription(
`
👤 **Player**
🎲 Roll: **${playerRoll}**

🤵 **Dealer**
🎲 Roll: **${dealerRoll}**

${result}
`
            )

            .setTimestamp();



        return message.reply({

            embeds:[
                embed
            ]

        });


    }

};
