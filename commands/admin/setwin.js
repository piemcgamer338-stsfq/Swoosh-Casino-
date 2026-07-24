const settingsService = require("../../services/settingsService");


module.exports = {

    name: "setwin",

    aliases: [],


    async execute(message, args) {


        // Admin check
        if (!message.member.permissions.has("Administrator")) {

            return message.reply(
                "❌ You need Administrator permission."
            );

        }



        const channel =
            message.mentions.channels.first();



        if (!channel) {

            return message.reply(
                "❌ Usage: `.setwin #channel`"
            );

        }



        await settingsService.setWinChannel(
            message.guild.id,
            channel.id
        );



        return message.reply(
`
✅ Winner channel updated!

🏆 Winning messages will now be sent in ${channel}.
`
        );


    }

};
