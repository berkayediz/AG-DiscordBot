"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("../Main");
class WordSystem {
    constructor() {
        this.status = true;
        this.waitingForWordTyping = false;
    }
    control(word) {
        return Main_1.App.getConfig().getWords('tr').includes(word);
    }
    controlUsed(word) {
        return Main_1.App.getConfig().getWords('used').includes(word);
    }
    pushUsed(word) {
        Main_1.App.getConfig().getWords('used').push(word);
    }
    reset(callback) {
        this.changeStatus(false);
        Main_1.App.getConfig().clearUsedWords();
        let alphabet = 'abcçdefghiıjklmnoöprsştuüvyz'.split('');
        const configData = Main_1.App.getConfig().getWordData();
        configData.lastCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
        configData.lastUserId = '';
        Main_1.App.getConfig().saveAll((error) => {
            if (error) {
                callback(error);
                return;
            }
            this.changeStatus(true);
            callback(null);
        });
    }
    changeStatus(status) {
        this.status = status;
    }
    changeTyping(waitingForWordTyping) {
        this.waitingForWordTyping = waitingForWordTyping;
    }
    isStatus() {
        return this.status;
    }
    isTyping() {
        return this.waitingForWordTyping;
    }
}
exports.default = new WordSystem();
