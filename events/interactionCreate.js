module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        if (!interaction.isStringSelectMenu() && !interaction.isButton()) return;

        const handler = client.interactions.get(interaction.customId);

        if (!handler) return;

        try {
            await handler.execute(interaction, client);
        } catch (error) {
            console.error(error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "❌ Something went wrong.",
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: "❌ Something went wrong.",
                    ephemeral: true
                });
            }
        }
    }
};
