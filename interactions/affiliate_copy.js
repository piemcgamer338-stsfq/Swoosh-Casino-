module.exports = {

    id: "affiliate_copy",

    async execute(interaction) {

        const affiliateService =
            require("../services/affiliateService");

        const affiliate =
            await affiliateService.getAffiliate(
                interaction.user.id
            );

        return interaction.reply({

            content:
`📋 Your referral code

**${affiliate.affiliateCode}**

Your friends can redeem it using:

\`.aff ${affiliate.affiliateCode}\``,

            ephemeral: true

        });

    }

};
