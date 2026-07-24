const Settings = require("../models/Settings");


async function sendWinner(
    client,
    user,
    amount,
    game
){

    const setting =
        await Settings.findOne({
            where:{
                key:"winner_channel"
            }
        });


    if(!setting)
        return;



    const channel =
        client.channels.cache.get(
            setting.value
        );


    if(!channel)
        return;



    channel.send(
`🎉 **${user.username}** won **${Number(amount).toFixed(2)} points** in ${game}!`
    );


}


module.exports = {
    sendWinner
};
