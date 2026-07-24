module.exports = {
    name: "affiliate",
    aliases: ["ref", "refercode"],

    async execute(message) {
        return message.reply(
`# 👥 Affiliate

Your referral system is currently disabled.

It will be rebuilt later.`
        );
    }
};
