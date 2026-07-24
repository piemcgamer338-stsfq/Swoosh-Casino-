const {
    EmbedBuilder
} = require("discord.js");


const {
    generateLTCAddress
} = require("../../services/ltcService");


const {
    getUser,
    updateUser
} = require("../../services/userService");



module.exports = {

    name: "deposit",

    aliases: ["dep"],



    async execute(message) {


        const user =
            await getUser(
                message.author.id
            );



        let address =
            user.ltc_address;



        // Generate new address if user doesn't have one

        if (!address) {


            // Use discord id as a simple index
            // (later we can make a proper counter)

            const index =
                Number(
                    BigInt(message.author.id) % BigInt(100000)
                );



            address =
                generateLTCAddress(
                    index
                );



            await updateUser(

                message.author.id,

                {
                    ltc_address: address
                }

            );


        }




        const embed =

        new EmbedBuilder()

        .setColor("#00ff99")

        .setTitle(
            "💰 Litecoin Deposit"
        )

        .setDescription(
`
Send **LTC only** to this address:

\`\`\`
${address}
\`\`\`

⚠️ Sending another coin may result in loss.

Network:
**Litecoin Mainnet**

Your deposits will be credited automatically.
`
        )

        .setFooter({

            text:
            "Swoosh Bet • LTC Deposits"

        });



        return message.reply({

            embeds:[
                embed
            ]

        });


    }

};
