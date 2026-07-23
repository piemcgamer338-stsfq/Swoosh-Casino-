const {
    EmbedBuilder
} = require("discord.js");

module.exports = {
    customId: "help-menu",

    async execute(interaction) {
        const value = interaction.values[0];

        const embed = new EmbedBuilder()
            .setColor("#C0C0C0");

        switch (value) {

            case "economy":
                embed
                    .setTitle("Economy Commands")
                    .setDescription([
                        "`.bal` - View balance",
                        "`.daily` - Claim daily",
                        "`.tip` - Send points",
                        "`.vault` - Open vault",
                        "`.deposit` - Deposit",
                        "`.withdraw` - Withdraw",
                        "`.price` - Convert points",
                        "`.profile` - View profile"
                    ].join("\n"));
                break;

            case "games":
                embed
                    .setTitle("Game Commands")
                    .setDescription([
                        "`.cf` Coinflip",
                        "`.d` Dice",
                        "`.bj` Blackjack",
                        "`.m` Mines",
                        "`.cr` Crash",
                        "`.r` Roulette",
                        "`.sl` Slots",
                        "`.market` Market"
                    ].join("\n"));
                break;

            case "wallet":
                embed
                    .setTitle("Wallet Commands")
                    .setDescription([
                        "`.addy` Deposit Address",
                        "`.transactions` History"
                    ].join("\n"));
                break;

            case "leaderboard":
                embed
                    .setTitle("Leaderboards")
                    .setDescription([
                        "`.lb` Richest",
                        "`.wlb` Wager",
                        "`.topwins` Winners"
                    ].join("\n"));
                break;

            case "general":
                embed
                    .setTitle("General")
                    .setDescription([
                        "`.help`",
                        "`.ping`",
                        "`.invite`",
                        "`.support`"
                    ].join("\n"));
                break;
        }

        return interaction.update({
            embeds: [embed]
        });
    }
};
