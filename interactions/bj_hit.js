module.exports = {

    customId: "bj_hit",

    async execute(interaction) {

        await interaction.reply({
            content: "🃏 Hit button clicked!",
            ephemeral: true
        });

    }

};
