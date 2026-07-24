const { EmbedBuilder } = require("discord.js");
const User = require("../models/User");

const {
    addBet,
    getRoulette,
    clearRoulette,
    spinRoulette,
    checkWin,
    payout
} = require("../utils/rouletteHandler");

async function select(interaction, bet){

    const game = getRoulette(interaction.user.id);

    if(!game)
        return interaction.reply({
            content:"No roulette running.",
            ephemeral:true
        });

    addBet(interaction.user.id, bet);

    return interaction.update({
        embeds:[
            new EmbedBuilder()
            .setColor("Red")
            .setTitle("🎰 Roulette")
            .setDescription(
`Bet: **${game.amount}**

Selected:
${game.bets.join(", ")}

Press **START**`
            )
        ],
        components: interaction.message.components
    });

}

async function start(interaction){

    const game = getRoulette(interaction.user.id);

    if(!game)
        return interaction.reply({
            content:"No roulette running.",
            ephemeral:true
        });

    await interaction.deferUpdate();

    await new Promise(r=>setTimeout(r,5000));

    const number = spinRoulette();

    let won = 0;

    for(const bet of game.bets){

        if(checkWin(number,bet))
            won += game.amount*payout(bet);

    }

    const user = await User.findOne({
        discordId:interaction.user.id
    });

    if(user){
        user.balance += won;
        await user.save();
    }

    clearRoulette(interaction.user.id);

    return interaction.editReply({

        embeds:[
            new EmbedBuilder()
            .setColor(won ? "Green":"Red")
            .setTitle("🎰 Roulette")
            .setDescription(
`# ${number}

Bet: ${game.amount}

Bets:
${game.bets.join(", ")}

${won ? `✅ Won ${won}`:`❌ Lost ${game.amount*game.bets.length}`}`
            )
        ],

        components:[]

    });

}

module.exports = {
    select,
    start
};
