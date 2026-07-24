const roulette = require("./rouletteHandler");

module.exports = {
    customId: "roulette_even",

    async execute(interaction) {
        return roulette.select(interaction, "even");
    }
};
