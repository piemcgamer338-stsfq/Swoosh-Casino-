module.exports = {
    bot: {
        name: process.env.BOT_NAME || "Swoosh Bet",
        prefix: process.env.BOT_PREFIX || ".",
        color: "#C0C0C0"
    },

    ownerId: process.env.OWNER_ID,

    database: {
        path: process.env.DATABASE_PATH || "./database/swoosh.db"
    },

    economy: {
        pointsPerDollar: Number(process.env.POINTS_PER_DOLLAR || 200),
        dailyReward: Number(process.env.DAILY_REWARD || 400),
        houseStartBalance: Number(process.env.HOUSE_START_BALANCE || 1000000)
    },

    wallet: {
        ltcXpub: process.env.LTC_XPUB || ""
    }
};
