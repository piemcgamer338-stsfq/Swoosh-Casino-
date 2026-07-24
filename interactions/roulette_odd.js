const roulette = require("./rouletteHandler");

module.exports = {
    customId: "roulette_odd",

    async execute(interaction) {
        return roulette.select(interaction, "odd");
    }
};
