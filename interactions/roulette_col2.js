const { handleRoulette } = require("./rouletteHandler");

module.exports = {
    customId: "roulette_col2",

    async execute(interaction) {
        return handleRoulette(interaction, "Column 2");
    }
};
