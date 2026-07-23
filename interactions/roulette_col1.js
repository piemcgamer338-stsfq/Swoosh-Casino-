const rouletteHandler = require("./rouletteHandler");

module.exports = {

    customId: "roulette_col1",

    async execute(interaction) {

        return rouletteHandler.execute(interaction);

    }

};
