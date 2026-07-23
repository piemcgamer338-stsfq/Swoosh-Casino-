module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        try {

            // Button games (coinflip, mines, blackjack etc.)
            // are handled by collectors inside the command files
            if (interaction.isButton()) {

                if (
                    interaction.customId.startsWith("cf_")
                ) {
                    return;
                }

            }


            if (!interaction.isStringSelectMenu() && !interaction.isButton()) {
                return;
            }


            const handler =
                client.interactions.get(
                    interaction.customId
                );


            if (!handler) return;


            await handler.execute(
                interaction,
                client
            );


        } catch (error) {

            console.error(
                "Interaction Error:",
                error
            );


            if (
                interaction.replied ||
                interaction.deferred
            ) {

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
