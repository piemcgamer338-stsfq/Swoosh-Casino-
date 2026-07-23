module.exports = {

    name: "interactionCreate",

    async execute(interaction, client) {


        if (!interaction.isButton() && !interaction.isStringSelectMenu()) {
            return;
        }


        try {


            // Mines buttons
            if (
                interaction.customId.startsWith("mine_") ||
                interaction.customId === "cashout"
            ) {
                return;
            }



            if (!client.interactions) {
                return;
            }



            const handler =
                client.interactions.get(
                    interaction.customId
                );



            if (!handler) {
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



            if (
                interaction.replied ||
                interaction.deferred
            ) {

                await interaction.followUp({

                    content:
                    "❌ Something went wrong.",

                    ephemeral:true

                }).catch(()=>{});


            } else {


                await interaction.reply({

                    content:
                    "❌ Something went wrong.",

                    ephemeral:true

                }).catch(()=>{});

            }


        }


    }

};
