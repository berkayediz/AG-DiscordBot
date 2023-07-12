import * as Discord from 'discord.js';
import { App } from '../../Main';

export default class MentionUtil {
  public static getMemberFromMention(guild: Discord.Guild, mention: string): Discord.GuildMember {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return guild.members.cache.get(mention);

    const id = matches[1];
    return guild.members.cache.get(id);
  }

  public static getChannelFromMention(guild: Discord.Guild, mention: string): Discord.GuildChannel {
    const matches = mention.match(/^<#(\d+)>$/);
    if (!matches) return guild.channels.cache.get(mention);

    const id = matches[1];
    return guild.channels.cache.get(id);
  }

  public static getRoleFromMention(guild: Discord.Guild, mention: string): Discord.Role {
    const matches = mention.match(/^<@&(\d+)>$/);
    if (!matches) return guild.roles.cache.get(mention);

    const id = matches[1];
    return guild.roles.cache.get(id);
  }
}
