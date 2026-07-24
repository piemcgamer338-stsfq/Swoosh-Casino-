const litecore = require("litecore-lib");


const XPUB = process.env.LTC_XPUB;



function generateLTCAddress(index = 0) {


    if (!XPUB) {

        throw new Error(
            "LTC_XPUB missing in environment variables"
        );

    }



    const hdPublicKey =
        new litecore.HDPublicKey(
            XPUB
        );



    const address =
        hdPublicKey
        .deriveChild(index)
        .publicKey
        .toAddress(
            litecore.Networks.livenet
        );



    return address.toString();


}



module.exports = {

    generateLTCAddress

};
