const {
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");


module.exports = {

    name: "thread",

    aliases: [],


    async execute(message, args) {


        const sub =
        args[0]?.toLowerCase();



        // CREATE THREAD
        if(sub === "create") {


            const thread =
            await message.channel.threads.create({

                name:
                `ticket-${message.author.username}`,

                autoArchiveDuration: 1440,

                type:
                ChannelType.PrivateThread,

                reason:
                "User created private thread"

            });



            await thread.members.add(
                message.author.id
            );


            return message.reply(
                `✅ Private thread created: ${thread}`
            );


        }




        // ADD USER
        if(sub === "add") {


            if(!message.channel.isThread()) {

                return message.reply(
                    "❌ This command must be used inside a thread."
                );

            }



            const user =
            message.mentions.users.first();



            if(!user) {

                return message.reply(
                    "❌ Mention a user."
                );

            }



            await message.channel.members.add(
                user.id
            );


            return message.reply(
                `✅ Added ${user} to the thread.`
            );

        }





        // REMOVE USER
        if(sub === "remove") {


            if(!message.channel.isThread()) {

                return message.reply(
                    "❌ This command must be used inside a thread."
                );

            }



            const user =
            message.mentions.users.first();



            if(!user) {

                return message.reply(
                    "❌ Mention a user."
                );

            }



            await message.channel.members.remove(
                user.id
            );


            return message.reply(
                `✅ Removed ${user} from the thread.`
            );

        }





        return message.reply(
`
❌ Usage:

\`.thread create\`

\`.thread add @user\`

\`.thread remove @user\`
`
        );


    }

};
