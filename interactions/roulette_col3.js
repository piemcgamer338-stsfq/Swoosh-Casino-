const roulette = require("./rouletteHandler");

module.exports = {
    customId: "roulette_col3",

    async execute(interaction) {
        return roulette.select(interaction, "col3");
    }
};
