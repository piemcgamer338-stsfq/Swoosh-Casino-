module.exports = {
    name: "aff",
    aliases: ["refer"],

    async execute(message) {
        return message.reply(
`⚠️ Referral system is currently disabled.

Use:
\`.affiliate\`

to view your referral code.`
        );
    }
};
