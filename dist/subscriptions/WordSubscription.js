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
const Discord = __importStar(require("discord.js"));
const AbstractSubscription_1 = __importDefault(require("../api/subscription/AbstractSubscription"));
const StringUtil_1 = __importDefault(require("../api/utils/StringUtil"));
const WordSystem_1 = __importDefault(require("../system/WordSystem"));
class WordSubscription extends AbstractSubscription_1.default {
    constructor() {
        super({
            id: 'Word',
        });
    }
    load() {
        this.bot.getClient().on('message', async (message) => {
            if (message.channel.type !== 'text')
                return;
            if (message.type !== 'DEFAULT')
                return;
            if (message.guild.id !== this.bot.getConfig().getConfig().bot.serverId)
                return;
            if (message.channel.id !== this.bot.getConfig().getConfig().channels.word_tr)
                return;
            if (message.author.bot)
                return;
            if (message.content[0] === '.')
                return;
            const allPrefix = Object.assign([], this.getBot().getConfig().getConfig().bot.prefix);
            allPrefix.push(`<@!${this.bot.getClient().user.id}> `);
            let prefix = null;
            for (const thisPrefix of allPrefix) {
                if (message.content.startsWith(thisPrefix))
                    prefix = thisPrefix;
            }
            if (prefix)
                return;
            if (!this.bot.getConfig().getConfig().word.status) {
                await message.delete();
                return;
            }
            if (!WordSystem_1.default.isStatus())
                return;
            if (WordSystem_1.default.isTyping()) {
                await message.delete();
                return;
            }
            let messageLower = message.content.toLocaleLowerCase('tr-TR');
            let lastCharacter = messageLower[messageLower.length - 1];
            const configData = this.bot.getConfig().getWordData();
            if (!configData)
                return;
            if (configData.lastUserId !== '' && message.author.id === configData.lastUserId) {
                message.delete();
                return;
            }
            if (lastCharacter.includes('ğ') && this.bot.getConfig().getWords('used').length < configData.limitFinishCount) {
                message.delete().then((message) => message.channel.send(new Discord.MessageEmbed({
                    description: `\`${StringUtil_1.default.capitalize(messageLower)}\` kelimesi \`${lastCharacter.toLocaleUpperCase('tr-TR')}\` ile bittiği için şu anda kullanamazsın! Biraz oyun devam etsin fındık, sakin ol!`,
                    color: '#8a8584',
                })));
                return;
            }
            if (WordSystem_1.default.control(messageLower)) {
                if (configData.lastCharacter !== '' &&
                    messageLower[0] !== configData.lastCharacter.toLocaleLowerCase('tr-TR')) {
                    message.delete().then((message) => message.channel
                        .send(new Discord.MessageEmbed({
                        description: `\`${StringUtil_1.default.capitalize(messageLower)}\` kelimesi \`${configData.lastCharacter.toUpperCase()}\` ile başlamıyor!`,
                        color: '#8a8584',
                    }))
                        .then((message) => message.delete({ timeout: 3500 })));
                    return;
                }
                WordSystem_1.default.changeTyping(true);
                if (WordSystem_1.default.controlUsed(messageLower)) {
                    WordSystem_1.default.changeTyping(false);
                    message.delete().then((message) => message.channel
                        .send(new Discord.MessageEmbed({
                        description: `\`${StringUtil_1.default.capitalize(messageLower)}\` kelimesi daha önce kullanılmış!`,
                        color: '#b52d0b',
                    }))
                        .then((message) => message.delete({ timeout: 3500 })));
                    return;
                }
                WordSystem_1.default.pushUsed(messageLower);
                configData.lastCharacter = lastCharacter;
                configData.lastUserId = message.author.id;
                const agUser = message.author;
                try {
                    if (!agUser.isCustomDataLoaded())
                        await agUser.loadCustomData();
                }
                catch (error) {
                    message.delete().then((message) => message.channel.send(new Discord.MessageEmbed({
                        description: `Bot sisteminde beklenmeyen bir hata oluştu. En kısa sürede çözülecektir!`,
                        color: '#b52d0b',
                    })));
                    WordSystem_1.default.changeTyping(true);
                    return;
                }
                agUser.getCustomData().wordPoint = agUser.getCustomData().wordPoint + 1;
                agUser
                    .saveCustomData()
                    .then(() => {
                    this.bot.getConfig().saveAll((error) => {
                        if (error) {
                            message.delete().then((message) => message.channel.send(new Discord.MessageEmbed({
                                description: `Bot sisteminde beklenmeyen bir hata oluştu. En kısa sürede çözülecektir!`,
                                color: '#b52d0b',
                            })));
                            WordSystem_1.default.changeTyping(true);
                            return;
                        }
                        message.react('✅');
                        WordSystem_1.default.changeTyping(false);
                    });
                })
                    .catch(() => {
                    message.delete().then((message) => message.channel.send(new Discord.MessageEmbed({
                        description: `Bot sisteminde beklenmeyen bir hata oluştu. En kısa sürede çözülecektir!`,
                        color: '#b52d0b',
                    })));
                    WordSystem_1.default.changeTyping(true);
                    return;
                });
                if (lastCharacter.includes('ğ')) {
                    WordSystem_1.default.reset((error) => {
                        if (error)
                            return;
                        message.channel.send(new Discord.MessageEmbed({
                            description: `\`Ğ\` ile biten bir kelime bulduğun için oyun yeniden başlatıldı.\n\`${configData.lastCharacter}\` ile kelime türetmeye devam edebilirsiniz.`,
                            color: '#29c458',
                        }));
                    });
                }
            }
            else {
                message.delete().then((message) => message.channel
                    .send(new Discord.MessageEmbed({
                    description: `\`${StringUtil_1.default.capitalize(messageLower)}\` TDK'da bulunmamakta!`,
                    color: '#b52d0b',
                }))
                    .then((message) => message.delete({ timeout: 3500 })));
            }
        });
    }
    close() { }
}
exports.default = WordSubscription;
