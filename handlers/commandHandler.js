const fs = require("fs");
const path = require("path");

function loadCommands(client) {
    const commandsPath = path.join(__dirname, "../commands");

    if (!fs.existsSync(commandsPath)) {
        fs.mkdirSync(commandsPath, { recursive: true });
    }

    const folders = fs.readdirSync(commandsPath);

    for (const folder of folders) {
        const folderPath = path.join(commandsPath, folder);

        if (!fs.statSync(folderPath).isDirectory()) continue;

        const commandFiles = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(path.join(folderPath, file));

            if (!command.name || !command.execute) continue;

            client.commands.set(command.name, command);

            if (Array.isArray(command.aliases)) {
                for (const alias of command.aliases) {
                    client.commands.set(alias, command);
                }
            }
        }
    }

    console.log(`✅ Loaded ${client.commands.size} commands`);
}

module.exports = loadCommands;
