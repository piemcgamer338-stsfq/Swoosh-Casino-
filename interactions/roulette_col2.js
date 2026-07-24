const roulette = require("./rouletteHandler");

module.exports = {
    customId: "roulette_col2",

    async execute(interaction) {
        return roulette.select(interaction, "col2");
    }
};
