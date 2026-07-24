module.exports = {

    id: "affiliate_info",

    async execute(interaction) {

        return interaction.reply({

            ephemeral: true,

            content:
`# 💸 Affiliate Guide

━━━━━━━━━━━━━━━━━━

### 🎁 Referral Reward

When someone redeems your code:

• They instantly receive **4 Points**

━━━━━━━━━━━━━━━━━━

### 💰 Passive Earnings

Every referral contributes to your earnings.

For every **200 Points wagered**
by one of your referrals,

You earn:

**+10 Points**

These rewards stack forever.

━━━━━━━━━━━━━━━━━━

### 📌 Important Rules

• You can only redeem **ONE** affiliate code.

• You cannot change your referrer later.

• You cannot redeem your own code.

• Referral rewards never expire.

━━━━━━━━━━━━━━━━━━

Use **.affiliate** anytime to
view your progress.`
        });

    }

};
