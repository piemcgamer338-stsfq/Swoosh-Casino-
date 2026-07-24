const {
    EmbedBuilder
} = require("discord.js");


const allowedWithdraw =
new Set();



module.exports = {

    name: "withdraw",

    aliases: ["with"],


    allowedWithdraw,


    async execute(message,args){


        // only DMs

        if(message.guild){

            return message.reply(
                "❌ Use this command in Bot DMs."
            );

        }



        if(!allowedWithdraw.has(message.author.id)){


            return message.reply(
`
❌ Must deposit 0.50$ and Wager 1.5x before withdraw .

Contact staff to enable withdrawals.
`
            );

        }



        const amount =
        Number(args[0]);



        const address =
        args[1];



        if(!amount || !address){


            return message.reply(
`
❌ Usage:

.withdraw [amount] [address]
`
            );

        }



        const embed =
        new EmbedBuilder()

        .setColor("#FFD700")

        .setTitle("💸 Withdraw Request")

        .setDescription(
`
User:
${message.author}

Amount:
**${amount} Points**

Address:
\`${address}\`

Status:
Pending manual approval.
`
        );



        const owner =
        await message.client.users.fetch(
            process.env.OWNER_ID
        );


        owner.send({
            embeds:[
                embed
            ]
        });



        message.reply(
            "✅ Withdraw Done Please contact any Admin and voucher them for Withdrawl ."
        );


    }

};
