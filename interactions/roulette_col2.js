const rouletteHandler = require("./rouletteHandler");

module.exports = {

    customId: "roulette_col2",

    async execute(interaction) {

        return rouletteHandler.execute(interaction);

    }

};
