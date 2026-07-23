const {
    EmbedBuilder
} = require("discord.js");

const balanceService = require("../../services/balanceService");


module.exports = {

    name: "limbo",

    aliases: [
        "l"
    ],


    async execute(message, args) {


        const bet =
            Number(args[0]);


        const target =
            Number(args[1]);



        if (!bet || !target) {

            return message.reply(
                "❌ Usage: `.limbo <bet> <multiplier>`"
            );

        }



        if (bet <= 0) {

            return message.reply(
                "❌ Invalid bet."
            );

        }



        if (target < 1.1 || target > 100) {

            return message.reply(
                "❌ Multiplier must be between 1.1x and 100x."
            );

        }



        const hasBalance =
            await balanceService.hasBalance(
                message.author.id,
                bet
            );


        if (!hasBalance) {

            return message.reply(
                "❌ You don't have enough balance."
            );

        }



        /*
            Limbo logic

            Low multipliers:
            - Better chance

            High multipliers:
            - Rare

            Max crash = 100x
        */


        let crash;



        const roll =
            Math.random();



        if (target <= 2) {


            if (roll < 0.65) {

                crash =
                    target +
                    Math.random() * 3;

            }

            else {

                crash =
                    1 +
                    Math.random();

            }


        }

        else {


            crash =
                Math.random() * 10 + 1;


            if (Math.random() < 0.02) {

                crash =
                    Math.random() * 90 + 10;

            }

        }



        crash =
            Number(
                crash.toFixed(2)
            );



        const win =
            crash >= target;



        let payout = 0;



        if (win) {

            payout =
                Math.floor(
                    bet * target
                );


            await balanceService.addBalance(
                message.author.id,
                payout,
                "limbo_win"
            );


        }

        else {


            await balanceService.removeBalance(
                message.author.id,
                bet,
                "limbo_loss"
            );


        }



        const embed =
            new EmbedBuilder()

            .setColor(
                win
                ? "#00ff88"
                : "#ff3333"
            )


            .setTitle(
                "🚀 LIMBO"
            )


            .setDescription(
`
# 💥 CRASHED AT

# ${crash}x


💰 **Bet**
${bet} Points


🎯 **Target**
${target}x


${
win
?
`🏆 **YOU WON**\n💵 Payout: **${payout} Points**`
:
`💀 **YOU LOST**`
}

`
            )


            .setFooter({
                text:
                message.author.username
            });



        await message.reply({
            embeds:[
                embed
            ]
        });


    }

};
