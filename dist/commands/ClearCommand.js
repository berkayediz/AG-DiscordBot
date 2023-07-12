"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearCommand = void 0;
const Discord = __importStar(require("discord.js"));
const AbstractCommand_1 = __importDefault(require("../api/command/AbstractCommand"));
const CommandPermissions_1 = __importDefault(require("../api/command/CommandPermissions"));
const MentionUtil_1 = __importDefault(require("../api/utils/MentionUtil"));
class ClearCommand extends AbstractCommand_1.default {
    constructor() {
        super({
            id: 'Clear',
            command: 'clear',
            description: 'Mesaj temizleme işlemi için kullanılır!',
            runIn: ['text'],
            requiredBotPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'VIEW_CHANNEL'],
            requiredPermission: CommandPermissions_1.default.STAFF,
        });
    }
    run(context) {
        if (context.getArgs().length < 1) {
            context.getMessage().react('❌');
            context
                .getMessage()
                .channel.send(`Mesaj temizleme işlemi \n\`${context.getOrganizedPrefix()}${context.getLabel()} silinecek miktar\`\n\`${context.getOrganizedPrefix()}${context.getLabel()} @kullanıcı silinecek miktar\`\n şeklinde olması gerekli!`);
            return;
        }
        const mentionedMember = MentionUtil_1.default.getMemberFromMention(context.getMessage().guild, context.getArgs()[0]);
        let amount;
        if (!mentionedMember)
            amount = Number(context.getArgs()[0]);
        if (!amount)
            amount = Number(context.getArgs()[1]);
        if (!amount)
            return;
        if (isNaN(amount)) {
            context.getMessage().react('❌');
            context
                .getMessage()
                .channel.send(`Mesaj temizleme işlemi \n\`${context.getOrganizedPrefix()}${context.getLabel()} silinecek miktar\`\n\`${context.getOrganizedPrefix()}${context.getLabel()} @kullanıcı silinecek miktar\`\n şeklinde olması gerekli!`);
            return;
        }
        if (amount > 100) {
            context.getMessage().react('❌');
            context.getMessage().channel.send(`Mesaj temizleme işleminde en fazla \`100\` adet mesaj silinebilir!`);
            return;
        }
        if (amount < 1) {
            context.getMessage().react('❌');
            context.getMessage().channel.send(`Mesaj temizleme işleminde en az \`1\` adet mesaj silinebilir!`);
            return;
        }
        context.getMessage().react('✅');
        context
            .getMessage()
            .channel.messages.fetch({ limit: amount })
            .then((messages) => {
            if (mentionedMember)
                messages = messages.filter((message) => message.author.id === mentionedMember.id);
            messages = messages.filter((message) => !message.pinned);
            context.getMessage().channel.bulkDelete(messages).then((messages) => {
                context
                    .getMessage()
                    .channel.send(new Discord.MessageEmbed({
                    description: `<@!${context.getMessage().author.id}> adlı yetkili tarafından ${mentionedMember ? `<@!${mentionedMember.id}> adlı fındığa ait` : ''} \`${messages.size}\` mesaj silindi!`,
                    author: { name: 'AGBot', iconURL: context.getMessage().guild.iconURL() },
                    color: '#29c458',
                }))
                    .then((message) => message.delete({ timeout: 2500 }));
            });
        })
            .catch(() => { });
    }
}
exports.ClearCommand = ClearCommand;
