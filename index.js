require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} = require("discord.js");


const loadCommands = require("./handlers/commandHandler");
const loadEvents = require("./handlers/eventHandler");
const loadInteractions = require("./handlers/interactionHandler");


const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent

    ],

    partials: [

        Partials.Channel,
        Partials.Message,
        Partials.User

    ]

});


// Commands
client.commands = new Collection();


// Interactions
client.interactions = new Map();


// Load systems
loadCommands(client);
loadInteractions(client);
loadEvents(client);


// Login
client.login(process.env.DISCORD_TOKEN);
