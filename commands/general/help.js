const {
    EmbedBuilder
} = require("discord.js");


module.exports = {

    name: "help",

    aliases: ["h"],


    async execute(message) {


        const embed = new EmbedBuilder()

        .setColor("#00ff99")

        .setTitle(
            "🎰 Swoosh Bet Help"
        )

        .setDescription(
`
Welcome to **Swoosh Bet** 🎲

Use the commands below to play and manage your account.
`
        )



        .addFields(

            {
                name: "🎮 GAMES",
                value:
`
> .limbo [amount] [multiplier]

> .coinflip [amount] [heads/tails]

> .blackjack [amount]

> .mines [amount] [1-24 bombs]

> .roulette [amount] [bet]
`,
                inline: true
            },



            {
                name: "💰 UTILITY",
                value:
`
> .deposit

> .withdraw [amount] [address]

> .balance [user]

> .tip [user] [amount]

> .affiliate

> .aff [code]
`,
                inline: true
            },



            {
                name: "📊 STATS",
                value:
`
> .stats [user]

> .leaderboard
`,
                inline: true
            },



            {
                name: "🧵 THREADS",
                value:
`
> .thread create

> .thread add [user]

> .thread remove [user]
`,
                inline: true
            },



            {
                name: "🎁 REWARDS",
                value:
`
> .rakeback

> .hourly
`,
                inline: true
            },



            {
                name: "⚙️ ADMIN",
                value:
`
> .setwin [channel]

> .addbal [user] [amount]
`,
                inline: true
            }


        )


        .setFooter({

            text:
            "Swoosh Bet • Fair games • Good luck 🎰"

        });



        return message.reply({

            embeds:[
                embed
            ]

        });


    }

};
