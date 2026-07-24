const {
    EmbedBuilder
} = require("discord.js");

const affiliateService = require("../../services/affiliateService");
const balanceService = require("../../services/balanceService");


module.exports = {

    name: "aff",

    aliases: [
        "refer"
    ],


    async execute(message, args) {


        const code = args[0];


        if (!code) {

            return message.reply({

                content:
                "❌ Usage: `.aff <affiliate code>`"

            });

        }



        const result =
            await affiliateService.redeemCode(
                message.author.id,
                code
            );



        if (!result.success) {

            return message.reply({

                content:
                `❌ ${result.message}`

            });

        }



        // Reward the person using code
        await balanceService.addBalance(
            message.author.id,
            4,
            "affiliate_join_reward"
        );



        // Reward the owner
        await balanceService.addBalance(
            result.owner.userId,
            5,
            "affiliate_referral_reward"
        );



        const embed = new EmbedBuilder()

            .setColor("#00ff66")

            .setTitle(
                "🎉 Affiliate Activated"
            )

            .setDescription(
`
## Successfully Referred

🎁 You received:

**+4 Points**

👑 Affiliate Owner earned:

**+5 Points**

Referred by:

\`${result.owner.code}\`

You cannot use another affiliate code again.
`
            )

            .setFooter({

                text:
                "Affiliate System"

            });



        return message.reply({

            embeds:[
                embed
            ]

        });


    }

};
