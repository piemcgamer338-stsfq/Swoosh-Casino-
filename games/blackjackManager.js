class BlackjackManager {

    constructor() {
        this.games = new Map();
    }

    create(messageId, game) {
        this.games.set(messageId, game);
    }

    get(messageId) {
        return this.games.get(messageId);
    }

    has(messageId) {
        return this.games.has(messageId);
    }

    delete(messageId) {
        return this.games.delete(messageId);
    }

    update(messageId, data) {

        const game = this.games.get(messageId);

        if (!game) return;

        Object.assign(game, data);

        this.games.set(messageId, game);
    }

}

module.exports = new BlackjackManager();
