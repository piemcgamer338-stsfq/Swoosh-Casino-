const crypto = require("crypto");


const affiliates = new Map();
const referrals = new Map();



function generateCode() {

    return crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

}



async function getOrCreateAffiliate(userId) {


    let affiliate = affiliates.get(userId);


    if (!affiliate) {

        affiliate = {

            userId,

            code: generateCode(),

            referrals: 0

        };


        affiliates.set(
            userId,
            affiliate
        );

    }


    return affiliate;

}




async function getAffiliate(userId) {


    const affiliate =
        affiliates.get(userId);


    if (!affiliate)
        return null;


    return affiliate;

}





async function redeemCode(userId, code) {


    // already used any affiliate
    if (referrals.has(userId)) {

        return {

            success:false,

            message:
            "You already used an affiliate code."

        };

    }



    let owner = null;


    for (const aff of affiliates.values()) {


        if (
            aff.code.toLowerCase()
            === code.toLowerCase()
        ) {

            owner = aff;

            break;

        }

    }



    if (!owner) {

        return {

            success:false,

            message:
            "Invalid affiliate code."

        };

    }



    if (owner.userId === userId) {

        return {

            success:false,

            message:
            "You cannot use your own affiliate code."

        };

    }



    referrals.set(
        userId,
        owner.userId
    );


    owner.referrals++;



    return {

        success:true,

        owner

    };


}





async function addReferralReward(ownerId) {

    const owner =
        affiliates.get(ownerId);


    if (!owner)
        return false;


    owner.referrals++;


    return true;

}




module.exports = {

    getOrCreateAffiliate,

    getAffiliate,

    redeemCode,

    addReferralReward

};
