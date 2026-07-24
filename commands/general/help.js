const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");


module.exports = {

    name: "help",

    aliases: ["h"],



    async execute(message,args,client){


        const commands =
            client.commands;



        const categories = {};



        commands.forEach(cmd=>{


            const category =
                cmd.category || "Other";


            if(!categories[category])
                categories[category] = [];



            categories[category].push(cmd);


        });





        const embed =
        new EmbedBuilder()

        .setColor("#00ff99")

        .setTitle(
            "🤖 Swoosh Bet Help"
        )

        .setDescription(
`
Welcome to **Swoosh Bet** 🎰

Select a category below to view commands.

Total Commands: **${commands.size}**
`
        );







        const menu =
        new StringSelectMenuBuilder()

        .setCustomId(
            "help_menu"
        )

        .setPlaceholder(
            "Choose a category"
        )

        .addOptions(

            Object.keys(categories)
            .map(cat=>({

                label:cat,

                value:cat

            }))

        );





        const row =
        new ActionRowBuilder()
        .addComponents(menu);





        return message.reply({

            embeds:[
                embed
            ],

            components:[
                row
            ]

        });



    }

};
