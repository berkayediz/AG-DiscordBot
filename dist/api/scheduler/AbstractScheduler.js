"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractScheduler {
    constructor(args) {
        this.id = args.id;
        if (args.ms) {
            if (args.ms.asMilliseconds) {
                this.ms = args.ms.asMilliseconds();
            }
            else {
                this.ms = args.ms;
            }
        }
    }
    start() {
        this.process = setInterval(() => {
            this.call();
        }, this.ms);
    }
    stop() {
        clearInterval(this.process);
    }
    call() {
        this.run();
    }
    load() {
        this.start();
    }
    setup(bot) {
        this.bot = bot;
    }
    close() {
        this.stop();
    }
    getBot() {
        return this.bot;
    }
    isActive() {
        return this.active;
    }
}
exports.default = AbstractScheduler;
