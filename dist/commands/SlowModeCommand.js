"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = __importDefault(require("../api/command/AbstractCommand"));
const CommandPermissions_1 = __importDefault(require("../api/command/CommandPermissions"));
const MentionUtil_1 = __importDefault(require("../api/utils/MentionUtil"));
const NumberUtil_1 = __importDefault(require("../api/utils/NumberUtil"));
class SlowModeCommand extends AbstractCommand_1.default {
    constructor() {
        super({
            id: 'SlowMode',
            command: 'slowmode',
            description: 'Belirli odanın slowmode özelliğini ayarlar.',
            runIn: ['text'],
            requiredBotPermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
            requiredPermission: CommandPermissions_1.default.STAFF,
        });
    }
    run(context) {
        if (context.getArgs().length < 2) {
            const channel = context.getMessage().channel;
            if (!NumberUtil_1.default.isNumeric(context.getArgs()[0])) {
                context.getMessage().react('❌');
                context.getMessage().channel.send('Belirttiğiniz sayı hatalı!');
                return;
            }
            channel.setRateLimitPerUser(parseInt(context.getArgs()[0]));
            context.getMessage().react('✅');
        }
        else {
            const channel = (MentionUtil_1.default.getChannelFromMention(context.getMessage().guild, context.getArgs()[0]));
            if (!channel) {
                context.getMessage().react('❌');
                context.getMessage().channel.send('Belirttiğiniz odaya ulaşamadım!');
                return;
            }
            if (!NumberUtil_1.default.isNumeric(context.getArgs()[1])) {
                context.getMessage().react('❌');
                context.getMessage().channel.send('Belirttiğiniz sayı hatalı!');
                return;
            }
            channel.setRateLimitPerUser(parseInt(context.getArgs()[1]));
            context.getMessage().react('✅');
        }
    }
}
exports.default = SlowModeCommand;
