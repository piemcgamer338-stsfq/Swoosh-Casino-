const {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
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



        const embed = new EmbedBuilder()

        .setColor("#FFD700")

        .setTitle("💰 Swoosh Bet Deposit")

        .setDescription(
`
Choose your deposit currency below.

After sending, wait for manual verification.
`
        )

        .setFooter({
            text: "Swoosh Bet"
        });



        const ltcButton =
        new ButtonBuilder()

        .setCustomId("deposit_ltc")

        .setLabel("LTC")

        .setStyle(ButtonStyle.Primary);



        const solButton =
        new ButtonBuilder()

        .setCustomId("deposit_sol")

        .setLabel("SOL")

        .setStyle(ButtonStyle.Success);



        const usdtButton =
        new ButtonBuilder()

        .setCustomId("deposit_usdt")

        .setLabel("USDT")

        .setStyle(ButtonStyle.Secondary);



        const row =
        new ActionRowBuilder()

        .addComponents(
            ltcButton,
            solButton,
            usdtButton
        );



        await message.author.send({

            embeds:[
                embed
            ],

            components:[
                row
            ]

        });



        message.reply(
            "📩 Deposit options have been sent to your DM."
        );

    },


    addresses:{
        ltc:
        "ltc1qcq2l6h5r0drx0hsg3796rk0phdtmq2fmjhh80s",

        sol:
        "43iwsPQnwKuGD7HsPVfxsfMTVD36f3z1qmECFxGxnoC8",

        usdt:
        "0x57C5961B988fF93Dd02D9eD5404D4A2c2C19CfC5"
    }

};
