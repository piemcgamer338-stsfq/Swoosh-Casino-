module.exports = {

    customId: "bj_stand",

    async execute(interaction) {

        await interaction.reply({
            content: "🛑 Stand button clicked!",
            ephemeral: true
        });

    }

};
