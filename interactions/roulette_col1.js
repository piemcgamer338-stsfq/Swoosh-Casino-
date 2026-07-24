const { handleRoulette } = require("./rouletteHandler");

module.exports = {
    customId: "roulette_col1",

    async execute(interaction) {
        return handleRoulette(interaction, "Column 1");
    }
};
