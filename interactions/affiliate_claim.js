const balanceService = require("../services/balanceService");
const affiliateService = require("../services/affiliateService");

module.exports = {

    id: "affiliate_claim",

    async execute(interaction) {

        const affiliate =
            await affiliateService.getAffiliate(
                interaction.user.id
            );

        if (affiliate.claimableBalance <= 0) {

            return interaction.reply({

                content: "❌ You have no claimable balance.",

                ephemeral: true

            });

        }

        const amount =
            await affiliateService.claim(
                interaction.user.id
            );

        await balanceService.addBalance(

            interaction.user.id,

            amount,

            "affiliate_claim"

        );

        return interaction.reply({

            content:
                `✅ Successfully claimed **${amount} Points!**`,

            ephemeral: true

        });

    }

};
