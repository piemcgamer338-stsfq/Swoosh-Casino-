const roulette = require("./rouletteHandler");

module.exports = {
    customId: "roulette_high",

    async execute(interaction) {
        return roulette.select(interaction, "high");
    }
};
