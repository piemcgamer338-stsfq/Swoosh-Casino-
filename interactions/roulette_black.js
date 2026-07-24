const roulette = require("./rouletteHandler");

module.exports = {
    customId: "roulette_black",

    async execute(interaction) {
        return roulette.select(interaction, "black");
    }
};
