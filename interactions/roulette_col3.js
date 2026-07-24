const { handleRoulette } = require("./rouletteHandler");

module.exports = {
    customId: "roulette_col3",

    async execute(interaction) {
        return handleRoulette(interaction, "Column 3");
    }
};
