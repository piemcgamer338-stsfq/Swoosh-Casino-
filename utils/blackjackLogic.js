function randomCard() {

    const suits = [
        "C",
        "D",
        "H",
        "S"
    ];


    const values = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K"
    ];


    const suit =
        suits[
            Math.floor(
                Math.random() * suits.length
            )
        ];


    const value =
        values[
            Math.floor(
                Math.random() * values.length
            )
        ];



    return {

        suit,

        value,


        image:
            `${suit}${value}.png`

    };

}




function handValue(hand) {

    let total = 0;

    let aces = 0;



    for (const card of hand) {


        if (card.value === "A") {

            total += 11;

            aces++;


        } else if (
            ["J","Q","K"]
            .includes(card.value)
        ) {


            total += 10;


        } else {


            total += Number(card.value);


        }

    }



    while (
        total > 21 &&
        aces > 0
    ) {

        total -= 10;

        aces--;

    }



    return total;

}




function isBlackjack(hand) {

    return (
        hand.length === 2 &&
        handValue(hand) === 21
    );

}




function isBust(hand) {

    return handValue(hand) > 21;

}




function dealerPlay(hand) {


    while (
        handValue(hand) < 17
    ) {


        hand.push(
            randomCard()
        );


    }


    return hand;

}




function getResult(player,dealer) {


    const p =
        handValue(player);


    const d =
        handValue(dealer);



    if(p > 21)
        return "lose";


    if(d > 21)
        return "win";


    if(p > d)
        return "win";


    if(d > p)
        return "lose";


    return "push";

}




module.exports = {

    randomCard,

    handValue,

    isBlackjack,

    isBust,

    dealerPlay,

    getResult

};
