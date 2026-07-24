const roulette = require("./rouletteHandler");

module.exports = {
    customId: "roulette_red",

    async execute(interaction) {
        return roulette.select(interaction, "red");
    }
};
