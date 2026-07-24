const {
    EmbedBuilder
} = require("discord.js");


module.exports = {

    name: "deposit",

    aliases: ["dep"],


    async execute(message) {


        const LTC =
        "ltc1qcq2l6h5r0drx0hsg3796rk0phdtmq2fmjhh80s";


        const SOL =
        "43iwsPQnwKuGD7HsPVfxsfMTVD36f3z1qmECFxGxnoC8";


        const USDT =
        "0x57C5961B988fF93Dd02D9eD5404D4A2c2C19CfC5";



        const embed =
        new EmbedBuilder()

        .setColor("#FFD700")

        .setTitle("💰 Swoosh Bet Deposit")

        .setDescription(
`
Send crypto to one of the addresses below.

**Litecoin (LTC)**
\`${LTC}\`

**Solana (SOL)**
\`${SOL}\`

**USDT (ETH Network)**
\`${USDT}\`

After sending, contact staff for manual verification.
`
        )

        .setFooter({
            text: "Swoosh Bet"
        });



        try {

            await message.author.send({
                embeds:[
                    embed
                ]
            });


            await message.reply(
                "📩 Deposit address sent to your DM."
            );


        } catch(err) {


            await message.reply(
                "❌ I can't DM you. Enable DMs from server members."
            );


        }

    }

};
