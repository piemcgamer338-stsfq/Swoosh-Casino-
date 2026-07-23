module.exports = {

    name: "interactionCreate",

    async execute(interaction, client) {


        if (
            !interaction.isButton() &&
            !interaction.isStringSelectMenu()
        ) {
            return;
        }


        try {


            // Let mines handle its own buttons
            if (
                interaction.customId.startsWith("mine_") ||
                interaction.customId === "cashout"
            ) {
                return;
            }



            if (!client.interactions) {
                console.log("No interaction map loaded");
                return;
            }



            const handler =
                client.interactions.get(
                    interaction.customId
                );



            if (!handler) {

                console.log(
                    "No handler for:",
                    interaction.customId
                );

                return;
            }



            await handler.execute(
                interaction,
                client
            );



        } catch(error) {


            console.error(
                "Interaction Error:",
                error
            );


            try {

                if (
                    interaction.replied ||
                    interaction.deferred
                ) {

                    await interaction.followUp({
                        content:
                        "❌ Something went wrong.",
                        ephemeral:true
                    });


                } else {


                    await interaction.reply({
                        content:
                        "❌ Something went wrong.",
                        ephemeral:true
                    });

                }

            } catch {}

        }

    }

};
