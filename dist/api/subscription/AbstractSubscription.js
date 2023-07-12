"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractSubscription {
    constructor(args) {
        this.id = args.id;
    }
    setup(bot) {
        this.bot = bot;
    }
    getBot() {
        return this.bot;
    }
}
exports.default = AbstractSubscription;
