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

// select()

// start()

module.exports = {
    select,
    start
};
