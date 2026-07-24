const Affiliate = require("../models/Affiliate");

function generateCode(length = 6) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";

    for (let i = 0; i < length; i++) {
        code += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return code;
}

async function createAffiliate(discordId) {

    let affiliate = await Affiliate.findOne({
        where: { discordId }
    });

    if (affiliate) return affiliate;

    let code;

    while (true) {

        code = generateCode();

        const exists = await Affiliate.findOne({
            where: {
                affiliateCode: code
            }
        });

        if (!exists) break;
    }

    affiliate = await Affiliate.create({
        discordId,
        affiliateCode: code
    });

    return affiliate;
}

async function getAffiliate(discordId) {

    let affiliate = await Affiliate.findOne({
        where: { discordId }
    });

    if (!affiliate)
        affiliate = await createAffiliate(discordId);

    return affiliate;
}

async function getByCode(code) {

    return await Affiliate.findOne({
        where: {
            affiliateCode: code.toUpperCase()
        }
    });

}

async function redeemCode(userId, code) {

    let userAffiliate = await getAffiliate(userId);

    if (userAffiliate.referredBy)
        return {
            success: false,
            message: "You have already used an affiliate code."
        };

    const owner = await getByCode(code);

    if (!owner)
        return {
            success: false,
            message: "Invalid affiliate code."
        };

    if (owner.discordId === userId)
        return {
            success: false,
            message: "You cannot use your own affiliate code."
        };

    userAffiliate.referredBy = owner.discordId;
    await userAffiliate.save();

    owner.referrals += 1;
    await owner.save();

    return {
        success: true,
        owner
    };
}

async function addReferralWager(userId, amount) {

    const userAffiliate = await getAffiliate(userId);

    if (!userAffiliate.referredBy)
        return;

    const owner = await getAffiliate(
        userAffiliate.referredBy
    );

    userAffiliate.wagerProgress += amount;

    while (userAffiliate.wagerProgress >= 200) {

        userAffiliate.wagerProgress -= 200;
        owner.claimableBalance += 10;

    }

    await owner.save();
    await userAffiliate.save();

}

async function claim(discordId) {

    const affiliate = await getAffiliate(discordId);

    const amount = affiliate.claimableBalance;

    affiliate.claimableBalance = 0;
    affiliate.totalClaimed += amount;

    await affiliate.save();

    return amount;

}

module.exports = {
    createAffiliate,
    getAffiliate,
    getByCode,
    redeemCode,
    addReferralWager,
    claim
};
