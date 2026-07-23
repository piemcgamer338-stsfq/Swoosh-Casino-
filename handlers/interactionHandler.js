const fs = require("fs");
const path = require("path");

function loadInteractions(client) {
    client.interactions = new Map();

    const interactionsPath = path.join(__dirname, "../interactions");

    if (!fs.existsSync(interactionsPath)) {
        fs.mkdirSync(interactionsPath, { recursive: true });
    }

    const files = fs
        .readdirSync(interactionsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of files) {
        const interaction = require(path.join(interactionsPath, file));

        if (!interaction.customId || !interaction.execute) continue;

        client.interactions.set(
            interaction.customId,
            interaction
        );
    }

    console.log(`✅ Loaded ${client.interactions.size} interactions`);
}

module.exports = loadInteractions;
