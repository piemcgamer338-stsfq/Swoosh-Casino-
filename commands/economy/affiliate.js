const affiliateService = require("../../services/affiliateService");
const balanceService = require("../../services/balanceService");


module.exports = {

    name: "affiliate",
    aliases: ["affcode"],


    async execute(message) {


        const result =
            await affiliateService.createAffiliate(
                message.author.id
            );


        if (!result.success) {

            return message.reply(
                `❌ ${result.message}`
            );

        }


        return message.reply(
`
# 💎 Your Affiliate Code Created

Your Code:

\`\`\`
${result.code}
\`\`\`

Give this code to your friends.

Rewards:

👤 Friend joins:
> They get **4 Points**

💰 You earn:
> **5 Points**

Your code can be used by unlimited players.
`
        );


    }

};
