const roulette = require("./rouletteHandler");

module.exports = {
    customId: "roulette_low",

    async execute(interaction) {
        return roulette.select(interaction, "low");
    }
};
