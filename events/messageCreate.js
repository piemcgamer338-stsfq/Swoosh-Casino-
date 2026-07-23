const config = require("../config/config");

module.exports = {
    name: "messageCreate",

    async execute(message, client) {

        if (message.author.bot) return;
        if (!message.guild) return;

        if (!message.content.startsWith(config.bot.prefix)) return;

        const args = message.content
            .slice(config.bot.prefix.length)
            .trim()
            .split(/\s+/);

        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const command = client.commands.get(commandName);

        if (!command) return;

        try {

            await command.execute(message, args, client);

        } catch (error) {

            console.error("========== COMMAND ERROR ==========");
            console.error(error);
            console.error("===================================");

            return message.reply({
                content: `❌ Error:\n\`\`\`\n${error.stack || error.message}\n\`\`\``
            });

        }

    }
};
