const config = require("../config/config");

function formatPoints(points) {
    return `${Number(points).toLocaleString()} Points`;
}

function pointsToUSD(points) {
    return (Number(points) / config.economy.pointsPerDollar).toFixed(2);
}

function formatUSD(points) {
    return `$${pointsToUSD(points)}`;
}

function usdToPoints(usd) {
    return Math.floor(Number(usd) * config.economy.pointsPerDollar);
}

module.exports = {
    formatPoints,
    pointsToUSD,
    formatUSD,
    usdToPoints
};
