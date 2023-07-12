"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandError_1 = __importDefault(require("./CommandError"));
class AbstractCommand {
    constructor(args) {
        this.runIn = ['text', 'dm'];
        this.id = args.id;
        this.command = args.command;
        if (!(args.aliases === undefined || args.aliases === null))
            this.aliases = args.aliases;
        this.description = args.description;
        if (args.runIn)
            this.runIn = args.runIn;
        if (args.requiredBotPermissions)
            this.requiredBotPermissions = args.requiredBotPermissions;
        if (args.requiredPermission)
            this.requiredPermission = args.requiredPermission;
    }
    call(context) {
        const currentChannelType = context.getMessage().channel.type === 'news' ? 'text' : context.getMessage().channel.type;
        if (!this.runIn.includes(currentChannelType)) {
            context.getMessage().channel.send('Bu komutu burada kullanamazsın!');
            return;
        }
        if (this.requiredBotPermissions.length > 0 && context.getMessage().guild) {
            for (const permission of this.requiredBotPermissions) {
                if (!context.getMessage().guild.me.hasPermission(permission))
                    return;
            }
        }
        if (this.requiredPermission) {
            try {
                this.requiredPermission.test(context);
            }
            catch (error) {
                if (error instanceof CommandError_1.default) {
                    context.getMessage().channel.send(error.message);
                    console.log(error);
                    return;
                }
            }
        }
        this.run(context);
    }
    load() { }
    setup(bot) {
        this.bot = bot;
    }
    close() { }
    getBot() {
        return this.bot;
    }
}
exports.default = AbstractCommand;
