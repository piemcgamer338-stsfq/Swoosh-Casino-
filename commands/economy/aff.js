const affiliateService = require("../../services/affiliateService");

module.exports = {

    name: "aff",
    aliases: ["refer"],

    async execute(message) {

        const data = await affiliateService.getAffiliate(
            message.author.id
        );

        if (!data) {
            return message.reply("❌ You don't have an affiliate code yet.");
        }


        return message.reply(
`
# 💎 Affiliate System

Your Affiliate Code:

\`\`\`
${data.code}
\`\`\`

Share this code with others.

Rewards:

👤 New player joins:
> They receive **4 Points**

💰 You earn:
> **5 Points** for every successful referral

🔥 More referrals = more passive income!
`
        );

    }

};
