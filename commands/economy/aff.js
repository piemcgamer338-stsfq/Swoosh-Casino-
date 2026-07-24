const affiliateService = require("../../services/affiliateService");
const balanceService = require("../../services/balanceService");

module.exports = {

    name: "aff",
    aliases: ["refer"],

    async execute(message, args) {

        const code = args[0];

        if (!code) {
            return message.reply(
                "❌ Usage: `.aff <code>`"
            );
        }

        const result = await affiliateService.redeemCode(
            message.author.id,
            code
        );

        if (!result.success) {
            return message.reply(
                `❌ ${result.message}`
            );
        }

        // Give player 4 Points
        await balanceService.addBalance(
            message.author.id,
            4,
            "affiliate_reward"
        );

        return message.reply(
`✅ Affiliate redeemed!

🎁 You received **4 Points**.

You are now permanently referred by **${result.owner.affiliateCode}**.

This action cannot be undone.`
        );

    }

};
