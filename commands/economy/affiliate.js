const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const affiliateService = require("../../services/affiliateService");

module.exports = {

    name: "affiliate",
    aliases: ["affinfo"],

    async execute(message) {

        const affiliate =
            await affiliateService.getAffiliate(
                message.author.id
            );

        const referredBy =
            affiliate.referredBy
                ? `<@${affiliate.referredBy}>`
                : "None";

        const embed =
            new EmbedBuilder()

            .setColor("#2ecc71")

            .setTitle("💸 Affiliate Dashboard")

            .setDescription(
`━━━━━━━━━━━━━━━━━━━━━━

👤 **Referred By**
${referredBy}

👥 **Total Referrals**
${affiliate.referrals}

💰 **Claimable Balance**
${affiliate.claimableBalance} Points

🏆 **Total Claimed**
${affiliate.totalClaimed} Points

━━━━━━━━━━━━━━━━━━━━━━

🎁 **Your Referral Code**

\`${affiliate.affiliateCode}\`

━━━━━━━━━━━━━━━━━━━━━━

### Rewards

• Every user using your code
gets **4 Points**

• Every **200 Points wagered**
by your referrals earns you

**10 Points**

━━━━━━━━━━━━━━━━━━━━━━

Use

\`.aff ${affiliate.affiliateCode}\`

to invite friends.
`
            );

        const row =
            new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()
                    .setCustomId("affiliate_claim")
                    .setLabel("Claim Balance")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("affiliate_copy")
                    .setLabel("Copy Code")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("affiliate_info")
                    .setLabel("How It Works")
                    .setStyle(ButtonStyle.Secondary)

            );

        return message.reply({

            embeds: [embed],
            components: [row]

        });

    }

};
