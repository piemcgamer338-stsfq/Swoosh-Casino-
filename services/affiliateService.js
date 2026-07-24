const crypto = require("crypto");

const affiliates = new Map();


async function createAffiliate(userId) {

    if (affiliates.has(userId)) {

        return {
            success:false,
            message:"You already have an affiliate code."
        };

    }


    const code =
        crypto.randomBytes(3)
        .toString("hex")
        .toUpperCase();


    affiliates.set(userId, {

        userId,
        code,
        referrals:0

    });


    return {

        success:true,
        code

    };

}



async function getAffiliate(userId) {

    const data =
        affiliates.get(userId);


    if(!data)
        return null;


    return {

        code:data.code,
        referrals:data.referrals

    };

}



async function redeemCode(userId, code) {


    for(const affiliate of affiliates.values()) {


        if(
            affiliate.code === code
        ) {


            if(
                affiliate.userId === userId
            ) {

                return {

                    success:false,
                    message:"You cannot use your own code."

                };

            }



            affiliate.referrals++;


            return {

                success:true,

                owner:affiliate

            };

        }

    }


    return {

        success:false,
        message:"Invalid affiliate code."

    };

}



module.exports = {

    createAffiliate,
    getAffiliate,
    redeemCode

};
