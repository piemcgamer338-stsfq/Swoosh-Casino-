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
            console.error(error);

            return message.reply({
                content: "❌ An unexpected error occurred while executing this command."
            });
        }
    }
};
