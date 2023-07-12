"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ImmutableCommandContext {
    constructor(bot, message, command, label, prefix, args) {
        this.bot = bot;
        this.message = message;
        this.command = command;
        this.label = label;
        this.prefix = prefix;
        this.args = args;
    }
    getBot() {
        return this.bot;
    }
    getLabel() {
        return this.label;
    }
    getCommand() {
        return this.command;
    }
    getPrefix() {
        return this.prefix;
    }
    getOrganizedPrefix() {
        return this.prefix.startsWith('<@!') ? this.getBot().getConfig().getConfig().bot.prefix[0] : this.prefix;
    }
    getMessage() {
        return this.message;
    }
    getAGServer() {
        return this.message.guild ? this.message.guild : this.bot.getAGServer();
    }
    getAGMember() {
        var agServer = this.getAGServer();
        return agServer === undefined || agServer === null ? null : agServer.members.cache.get(this.getMessage().author.id);
    }
    getAGMemberById(id) {
        var agServer = this.getAGServer();
        return agServer === undefined || agServer === null ? null : agServer.members.cache.get(id);
    }
    isDirectMessage() {
        return this.getMessage().channel.type === 'dm';
    }
    isGuildText() {
        return ['text', 'news'].includes(this.getMessage().channel.type);
    }
    reply(...messages) {
        this.message.channel.send(messages.join('\n'));
    }
    getArgs() {
        return this.args;
    }
    getImmutableArgs() {
        return Object.assign([], this.args);
    }
    clone(newLabel, newArgs) {
        const newContext = new ImmutableCommandContext(this.bot, this.message, this.command, newLabel ? newLabel : this.label, this.prefix, newArgs ? newArgs : this.args);
        return newContext;
    }
}
exports.default = ImmutableCommandContext;
