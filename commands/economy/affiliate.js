const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const affiliateService = require("../../services/affiliateService");


module.exports = {

    name: "affiliate",
    aliases: ["affiliatecode"],


    async execute(message) {


        const affiliate =
            await affiliateService.getOrCreateAffiliate(
                message.author.id
            );


        const embed = new EmbedBuilder()

            .setColor("#FFD700")

            .setTitle("💎 Affiliate Program")

            .setDescription(
`
# Your Affiliate Code

\`\`\`
${affiliate.code}
\`\`\`

Share this code with your friends.

## Rewards

👤 Friend joins:
> +4 Points

💰 You earn:
> +5 Points per referral

🔥 Passive income forever.
`
            )

            .setFooter({
                text:
                "Affiliate System"
            });



        const button =
            new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                .setCustomId(
                    `affiliate_copy_${affiliate.code}`
                )

                .setLabel(
                    "📋 Copy Code"
                )

                .setStyle(
                    ButtonStyle.Primary
                )

            );



        return message.reply({

            embeds:[
                embed
            ],

            components:[
                button
            ]

        });


    }

};
