const config = require("../config/config");
const { ActivityType } = require("discord.js");

module.exports = {
    name: "clientReady",
    once: true,

    async execute(client) {
        console.clear();

        console.log("========================================");
        console.log(`       ${config.bot.name} Online`);
        console.log("========================================");
        console.log(`🤖 Logged in as: ${client.user.tag}`);
        console.log(`🆔 Bot ID: ${client.user.id}`);
        console.log(`🌐 Servers: ${client.guilds.cache.size}`);
        console.log("========================================");

        client.user.setPresence({
            activities: [
                {
                    name: `${config.bot.prefix}help | ${config.bot.name}`,
                    type: ActivityType.Playing
                }
            ],
            status: "online"
        });
    }
};
