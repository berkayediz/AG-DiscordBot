"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ImmutableCommandContext_1 = __importDefault(require("../api/command/ImmutableCommandContext"));
const AbstractSubscription_1 = __importDefault(require("../api/subscription/AbstractSubscription"));
class CommandSubscription extends AbstractSubscription_1.default {
    constructor() {
        super({
            id: 'Command',
        });
    }
    load() {
        this.bot.getClient().on('message', (message) => {
            if (message.guild) {
                if (message.guild.id !== this.bot.getConfig().getConfig().bot.serverId)
                    return;
                if (this.bot.getConfig().getConfig().commands.onlyChannels.status &&
                    !this.bot.getConfig().getConfig().commands.onlyChannels.data.includes(message.channel.id))
                    return;
            }
            if (message.author.bot)
                return;
            const allPrefix = Object.assign([], this.getBot().getConfig().getConfig().bot.prefix);
            allPrefix.push(`<@!${this.bot.getClient().user.id}> `);
            let prefix = null;
            for (const thisPrefix of allPrefix) {
                if (message.content.startsWith(thisPrefix))
                    prefix = thisPrefix;
            }
            if (!prefix)
                return;
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            const commandObject = this.getBot().getCommandManager().getCommand(command);
            if (commandObject == null)
                return;
            commandObject.call(new ImmutableCommandContext_1.default(this.bot, message, commandObject, command, prefix, args));
        });
    }
    close() { }
}
exports.default = CommandSubscription;
