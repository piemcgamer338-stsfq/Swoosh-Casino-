const roulette = require("./rouletteHandler");

module.exports = {
    customId: "roulette_start",

    async execute(interaction) {
        return roulette.start(interaction);
    }
};
