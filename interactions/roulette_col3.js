const rouletteHandler = require("./rouletteHandler");

module.exports = {

    customId: "roulette_col3",

    async execute(interaction) {

        return rouletteHandler.execute(interaction);

    }

};
