"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MentionUtil {
    static getMemberFromMention(guild, mention) {
        const matches = mention.match(/^<@!?(\d+)>$/);
        if (!matches)
            return guild.members.cache.get(mention);
        const id = matches[1];
        return guild.members.cache.get(id);
    }
    static getChannelFromMention(guild, mention) {
        const matches = mention.match(/^<#(\d+)>$/);
        if (!matches)
            return guild.channels.cache.get(mention);
        const id = matches[1];
        return guild.channels.cache.get(id);
    }
    static getRoleFromMention(guild, mention) {
        const matches = mention.match(/^<@&(\d+)>$/);
        if (!matches)
            return guild.roles.cache.get(mention);
        const id = matches[1];
        return guild.roles.cache.get(id);
    }
}
exports.default = MentionUtil;
