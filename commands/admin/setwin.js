const Settings = require("../../models/Settings");


module.exports = {

    name:"setwin",

    aliases:[],


    async execute(message,args){


        if(!message.member.permissions.has("Administrator"))
            return message.reply(
                "❌ Admin only."
            );



        const channel =
            message.mentions.channels.first();



        if(!channel)
            return message.reply(
                "❌ Usage: `.setwin #channel`"
            );



        await Settings.upsert({

            key:"winner_channel",

            value:channel.id

        });



        return message.reply(
`✅ Winner channel set!

🏆 Winners will now be announced in ${channel}.`
        );


    }

};
