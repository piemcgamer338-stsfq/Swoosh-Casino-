const embed = require("../../utils/embed");

module.exports = {
    name: "ping",

    async execute(message, args, client) {

        const sent = await message.reply({
            embeds: [
                embed.createEmbed(
                    "Pinging...",
                    "Calculating latency..."
                )
            ]
        });

        const api = Math.round(client.ws.ping);
        const bot = sent.createdTimestamp - message.createdTimestamp;

        return sent.edit({
            embeds: [
                embed.createEmbed(
                    "🏓 Pong!",
                    [
                        `🤖 **Bot:** ${bot}ms`,
                        `🌐 **API:** ${api}ms`
                    ].join("\n")
                )
            ]
        });

    }
};
