const { EmbedBuilder } = require("discord.js");
const config = require("../config/config");

function createEmbed(title, description = "") {
    return new EmbedBuilder()
        .setColor(config.bot.color)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();
}

function success(description) {
    return new EmbedBuilder()
        .setColor("Green")
        .setDescription(`✅ ${description}`)
        .setTimestamp();
}

function error(description) {
    return new EmbedBuilder()
        .setColor("Red")
        .setDescription(`❌ ${description}`)
        .setTimestamp();
}

module.exports = {
    createEmbed,
    success,
    error
};
