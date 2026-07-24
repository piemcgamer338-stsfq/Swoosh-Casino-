module.exports = {

    name: "affiliate_copy",


    async execute(interaction) {


        const code =
            interaction.customId
            .replace(
                "affiliate_copy_",
                ""
            );



        return interaction.reply({

            content:
            `📋 Your affiliate code:

\`${code}\`

Copy it and share it with your friends!`,

            ephemeral:true

        });


    }

};
