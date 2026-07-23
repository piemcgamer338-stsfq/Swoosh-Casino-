const fs = require("fs");
const path = require("path");

function loadEvents(client) {
    const eventsPath = path.join(__dirname, "../events");

    if (!fs.existsSync(eventsPath)) {
        fs.mkdirSync(eventsPath, { recursive: true });
    }

    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {
        const event = require(path.join(eventsPath, file));

        if (!event.name || !event.execute) continue;

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }

    console.log(`✅ Loaded ${eventFiles.length} events`);
}

module.exports = loadEvents;
