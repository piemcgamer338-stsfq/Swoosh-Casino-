const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const config = require("../config/config");

const dbFolder = path.dirname(config.database.path);

if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
}

const db = new Database(config.database.path);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_id TEXT UNIQUE NOT NULL,

    balance INTEGER DEFAULT 0,
    vault INTEGER DEFAULT 0,

    wagered INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    lost INTEGER DEFAULT 0,

    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,

    force_lose INTEGER DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS house (
    id INTEGER PRIMARY KEY,
    balance INTEGER NOT NULL
);
`);

const house = db
    .prepare("SELECT * FROM house WHERE id = 1")
    .get();

if (!house) {
    db.prepare(
        "INSERT INTO house (id, balance) VALUES (1, ?)"
    ).run(config.economy.houseStartBalance);
}

console.log("✅ Database initialized");

module.exports = db;
