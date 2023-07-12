import * as Discord from 'discord.js';
import Permission from '../utils/Permission';
import CommandError from './CommandError';
import CommandPermission from './CommandPermission';

export default class CommandPermissions {
  public static USER: CommandPermission = {
    test: async () => {},
  } as CommandPermission;

  public static BOT_OWNER: CommandPermission = {
    test: async (context) => {
      if (context.getMessage().author.id !== context.getBot().getConfig().getConfig().bot.ownerId) {
        throw new CommandError('Bu komutu sadece bot sahibi kullanabilir!');
      }
    },
  } as CommandPermission;

  public static OWNER: CommandPermission = {
    test: async (context) => {
      let guild;
      if (context.isDirectMessage()) {
        guild = context.getAGServer();
        if (!guild.members.cache.some((member) => member.id === context.getMessage().author.id))
          throw new CommandError('Bu komutu sadece Anıl Güler sunucusunda olanlar kullanabilir!');
      } else guild = context.getMessage().guild;
      if (guild.ownerID !== context.getMessage().author.id) {
        throw new CommandError('Bu komutu sadece sunucu sahibi kullanabilir!');
      }
    },
  } as CommandPermission;

  public static STAFF: CommandPermission = {
    test: async (context) => {
      let guild;
      if (context.isDirectMessage()) guild = context.getAGServer();
      else guild = context.getMessage().guild;
      const member = context.isDirectMessage()
        ? guild.members.cache.get(context.getMessage().author.id)
        : context.getMessage().member;
      if (member === undefined || member === null)
        throw new CommandError('Bu komutu sadece Anıl Güler sunucusunda olanlar kullanabilir!');
      if (
        !(
          guild.ownerID === member.id ||
          member.hasPermission('ADMINISTRATOR') ||
          member.hasPermission('MANAGE_GUILD') ||
          Permission.anyRole(member, 'staff')
        )
      ) {
        throw new CommandError('Bu komutu sadece sunucu yetkilisi kullanabilir!');
      }
    },
  } as CommandPermission;

  public static STAFF_WITH_QUEUE(minQueue: number): CommandPermission {
    return {
      test: async (context) => {
        let guild;
        if (context.isDirectMessage()) guild = context.getAGServer();
        else guild = context.getMessage().guild;
        const member = context.isDirectMessage()
          ? guild.members.cache.get(context.getMessage().author.id)
          : context.getMessage().member;
        if (member === undefined || member === null)
          throw new CommandError('Bu komutu sadece Anıl Güler sunucusunda olanlar kullanabilir!');
        var queue = Permission.getQueue(member, 'staff');
        if (
          !(
            guild.ownerID === member.id ||
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('MANAGE_GUILD') ||
            (queue !== -1 && queue < minQueue)
          )
        ) {
          throw new CommandError('Bu komutu sadece sunucu yetkilisi kullanabilir!');
        }
      },
    } as CommandPermission;
  }
}
