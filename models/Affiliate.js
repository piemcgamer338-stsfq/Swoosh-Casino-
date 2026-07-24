const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Affiliate = sequelize.define("Affiliate", {

    discordId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    affiliateCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    referredBy: {
        type: DataTypes.STRING,
        defaultValue: null
    },

    referrals: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    claimableBalance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    totalClaimed: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    wagerProgress: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }

});

module.exports = Affiliate;
