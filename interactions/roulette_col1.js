const roulette = require("./rouletteHandler");

module.exports = {
    customId: "roulette_col1",

    async execute(interaction) {
        return roulette.select(interaction, "col1");
    }
};
