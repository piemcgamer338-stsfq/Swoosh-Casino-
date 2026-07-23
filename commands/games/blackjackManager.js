const games = new Map();

function createGame(userId, data) {
    games.set(userId, data);
}

function getGame(userId) {
    return games.get(userId);
}

function deleteGame(userId) {
    games.delete(userId);
}

module.exports = {
    createGame,
    getGame,
    deleteGame
};
