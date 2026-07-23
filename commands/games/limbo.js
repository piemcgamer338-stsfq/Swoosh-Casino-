const {
    EmbedBuilder,
    AttachmentBuilder
} = require("discord.js");

const path = require("path");

const {
    hasBalance,
    removeBalance,
    addBalance
} = require("../../services/balanceService");



module.exports = {

    name: "limbo",

    aliases: ["rocket"],



    async execute(message, args) {


        const bet = Number(args[0]);
        const target = Number(args[1]);



        if (
            !bet ||
            bet <= 0 ||
            !target ||
            target < 1.1 ||
            target > 100
        ) {

            return message.reply(
                "❌ Usage: `.limbo <bet> <multiplier>`\nExample: `.limbo 10 2`"
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
            "limbo_bet"
        );



        const image =
            new AttachmentBuilder(
                path.join(
                    __dirname,
                    "../../assets/limbo.png"
                ),
                {
                    name: "limbo.png"
                }
            );



        const loading =
            await message.reply({

                embeds: [

                    new EmbedBuilder()

                    .setColor("#f1c40f")

                    .setTitle("🚀 Limbo")

                    .setDescription(
`
💰 **Bet**
${bet} Points

🎯 **Target**
${target.toFixed(2)}x

🚀 Rocket launching...

⏳ Please wait...
`
                    )

                    .setImage(
                        "attachment://limbo.png"
                    )

                ],

                files: [image]

            });



        // Casino delay

        await new Promise(
            resolve => setTimeout(resolve, 3000)
        );



        // Generate crash multiplier

        let crash =
            Math.random() * 100;



        crash =
            Math.max(
                1.00,
                Number(
                    crash.toFixed(2)
                )
            );



        let result = "";
        let color = "#e74c3c";



        if (crash >= target) {


            const payout =
                Math.floor(
                    bet * target
                );



            await addBalance(
                message.author.id,
                payout,
                "limbo_win"
            );



            color = "#2ecc71";



            result =
`
🏆 **YOU WON!**

🚀 Rocket reached:
**${crash}x**

💰 Payout:
**${payout} Points**
`;



        }

        else {



            result =
`
💥 **ROCKET CRASHED!**

🚀 Crash point:
**${crash}x**

💀 You Lost:
**${bet} Points**
`;

        }





        const embed =
            new EmbedBuilder()

            .setColor(color)

            .setTitle("🚀 Limbo")

            .setDescription(
`
💰 **Bet**
${bet} Points

🎯 **Target**
${target.toFixed(2)}x

${result}
`
            )

            .setImage(
                "attachment://limbo.png"
            )

            .setTimestamp();



        return loading.edit({

            embeds: [
                embed
            ],

            files: [
                image
            ]

        });



    }

};
