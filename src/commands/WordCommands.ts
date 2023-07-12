import * as Discord from 'discord.js';
import AbstractCommand from '../api/command/AbstractCommand';
import CommandContext from '../api/command/CommandContext';
import CommandPermissions from '../api/command/CommandPermissions';
import AGUser from '../api/user/AGUser';
import MentionUtil from '../api/utils/MentionUtil';
import NumberUtil from '../api/utils/NumberUtil';
import WordSystem from '../system/WordSystem';

export class TopCommand extends AbstractCommand {
  constructor() {
    super({
      id: 'Word:Top',
      command: 'kelimesıralama',
      aliases: ['kelimesiralama'],
      description: 'Kelime oyununun sıralamasını gösterir!',
      runIn: ['text', 'dm'],
      requiredBotPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      requiredPermission: CommandPermissions.USER,
    });
  }

  run(context: CommandContext): void {
    const topData = this.bot.getConfig().getWordTop();
    if (topData.length < 1) {
      context.getMessage().react('❌');
      context.getMessage().channel.send(
        new Discord.MessageEmbed({
          description: `Kelime türetmece bilgisi mevcut değil!`,
          color: '#b52d0b',
        })
      );
      return;
    }
    let queue = 0;
    context.getMessage().react('✅');
    context.getMessage().channel.send(
      new Discord.MessageEmbed({
        description: `Kelime türetmecede en fazla puana sahip ilk \`${topData.length}\` fındık;\n\n${topData
          .sort((a, b) => {
            if (a.value > b.value) {
              return -1;
            }
            if (a.value < b.value) {
              return 1;
            }
            return 0;
          })
          .map((data) => {
            queue++;
            const member = context.getAGServer().members.cache.get(data.uniqueId);
            if (!member) return `  \`${queue} - Hatalı (0 Puan)\``;
            return `  \`${queue.toString()} - ${member.nickname ? member.nickname : member.user.username} (${
              data.value
            } Puan)\``;
          })
          .join('\n')}`,
        author: {
          name: 'AGBot',
          iconURL: context.getAGServer().iconURL(),
        },
        color: '#29c458',
      })
    );
  }
}

export class PointCommand extends AbstractCommand {
  constructor() {
    super({
      id: 'Word:Point',
      command: 'kelimepuan',
      description: 'Kelime oyununda kaç puanınız olduğuna bakmak için kullanılır!',
      runIn: ['text', 'dm'],
      requiredBotPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      requiredPermission: CommandPermissions.USER,
    });
  }

  async run(context: CommandContext): Promise<void> {
    if (context.getArgs().length < 1) {
      const agUser: AGUser = <AGUser>(
        (context.getMessage().guild ? context.getMessage().member.user : context.getMessage().author)
      );
      if (!agUser.isCustomDataLoaded()) await agUser.loadCustomData();
      context.getMessage().react('✅');
      context
        .getMessage()
        .channel.send(`<@${agUser.id}> adlı fındığın kelime oyunundaki puanı \`${agUser.getCustomData().wordPoint}\``);
    } else {
      const mentionMember = MentionUtil.getMemberFromMention(context.getAGServer(), context.getArgs()[0]);
      if (!mentionMember) {
        context.getMessage().react('❌');
        context.getMessage().channel.send('Bir kullanıcıyı etiketlemeniz lazım!');
        return;
      }
      const agUser: AGUser = <AGUser>mentionMember.user;
      if (!agUser.isCustomDataLoaded()) await agUser.loadCustomData();
      context.getMessage().react('✅');
      context
        .getMessage()
        .channel.send(
          `<@${mentionMember.id}> adlı fındığın kelime oyunundaki puanı \`${agUser.getCustomData().wordPoint}\``
        );
    }
  }
}

export class PointProcessCommand extends AbstractCommand {
  constructor() {
    super({
      id: 'Word:PointProcess',
      command: 'kelimeislem',
      aliases: ['kelimeişlem'],
      description: 'Kelime oyununda puan işlemleri için kullanılır!',
      runIn: ['text', 'dm'],
      requiredBotPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      requiredPermission: CommandPermissions.BOT_OWNER,
    });
  }

  async run(context: CommandContext): Promise<void> {
    if (context.getArgs().length < 1 || (context.getArgs().length > 0 && context.getArgs()[0] === 'help')) {
      context.getMessage().channel.send('');
    } else {
      const process = context.getArgs()[0];
      if (process === 'increase' && context.getArgs().length == 3) {
        const agUser = await this.getAgUser(context.getAGServer(), context.getArgs()[1]);
        if (!agUser) {
          context.getMessage().react('❌');
          context.getMessage().channel.send('Bir kullanıcıyı etiketlemeniz lazım!');
          return;
        }
        if (!NumberUtil.isNumeric(context.getArgs()[2])) {
          context.getMessage().react('❌');
          context.getMessage().channel.send('Belirttiğiniz sayı hatalı!');
          return;
        }
        const data = parseInt(context.getArgs()[2]);
        try {
          agUser.increaseWp(data);
        } catch (error) {
          context.getMessage().react('❌');
          context.getMessage().channel.send(error.message);
          return;
        }
        await agUser.saveCustomData();
        context.getMessage().react('✅');
        context
          .getMessage()
          .channel.send(
            `<@${agUser.id}> adlı fındığın kelime oyunundaki puanı <@${
              context.getMessage().author.id
            }> adlı yetkili tarafından \`${data}\` arttırıldı!\nŞu anda ki puanı \`${
              agUser.getCustomData().wordPoint
            }\``
          );
      } else if (process === 'decrease' && context.getArgs().length == 3) {
        const agUser = await this.getAgUser(context.getAGServer(), context.getArgs()[1]);
        if (!agUser) {
          context.getMessage().react('❌');
          context.getMessage().channel.send('Bir kullanıcıyı etiketlemeniz lazım!');
          return;
        }
        if (!NumberUtil.isNumeric(context.getArgs()[2])) {
          context.getMessage().react('❌');
          context.getMessage().channel.send('Belirttiğiniz sayı hatalı!');
          return;
        }
        const data = parseInt(context.getArgs()[2]);
        try {
          agUser.decreaseWp(data);
        } catch (error) {
          context.getMessage().react('❌');
          context.getMessage().channel.send(error.message);
          return;
        }
        await agUser.saveCustomData();
        context.getMessage().react('✅');
        context
          .getMessage()
          .channel.send(
            `<@${agUser.id}> adlı fındığın kelime oyunundaki puanı <@${
              context.getMessage().author.id
            }> adlı yetkili tarafından \`${data}\` azaltıldı!\nŞu anda ki puanı \`${agUser.getCustomData().wordPoint}\``
          );
      } else if (process === 'clear' && context.getArgs().length == 2) {
        const agUser = await this.getAgUser(context.getAGServer(), context.getArgs()[1]);
        if (!agUser) {
          context.getMessage().react('❌');
          context.getMessage().channel.send('Bir kullanıcıyı etiketlemeniz lazım!');
          return;
        }
        try {
          agUser.clearWp();
        } catch (error) {
          context.getMessage().react('❌');
          context.getMessage().channel.send(error.message);
          return;
        }
        await agUser.saveCustomData();
        context.getMessage().react('✅');
        context
          .getMessage()
          .channel.send(
            `<@${agUser.id}> adlı fındığın kelime oyunundaki puanı <@${
              context.getMessage().author.id
            }> adlı yetkili tarafından sıfırlandı!`
          );
      } else if (process === 'set' && context.getArgs().length == 3) {
        const agUser = await this.getAgUser(context.getAGServer(), context.getArgs()[1]);
        if (!agUser) {
          context.getMessage().react('❌');
          context.getMessage().channel.send('Bir kullanıcıyı etiketlemeniz lazım!');
          return;
        }
        if (!NumberUtil.isNumeric(context.getArgs()[2])) {
          context.getMessage().react('❌');
          context.getMessage().channel.send('Belirttiğiniz sayı hatalı!');
          return;
        }
        const data = parseInt(context.getArgs()[2]);
        try {
          agUser.setWp(data);
        } catch (error) {
          context.getMessage().react('❌');
          context.getMessage().channel.send(error.message);
          return;
        }
        await agUser.saveCustomData();
        context.getMessage().react('✅');
        context
          .getMessage()
          .channel.send(
            `<@${agUser.id}> adlı fındığın kelime oyunundaki puanı <@${
              context.getMessage().author.id
            }> adlı yetkili tarafından \`${data}\` olarak ayarlandı!`
          );
      } else if (process === 'info' && context.getArgs().length == 2) {
        const agUser = await this.getAgUser(context.getAGServer(), context.getArgs()[1]);
        if (!agUser) {
          context.getMessage().react('❌');
          context.getMessage().channel.send('Bir fındığı etiketlemeniz lazım!');
          return;
        }
        context.getMessage().react('✅');
        context
          .getMessage()
          .channel.send(
            `<@${agUser.id}> adlı fındığın kelime oyunundaki puanı \`${agUser.getCustomData().wordPoint}\``
          );
      } else {
        context.getMessage().react('❌');
        context.getMessage().channel.send('Yapmak istediğini anlayamadım!');
      }
    }
  }

  async getAgUser(guild: Discord.Guild, mentionText: string): Promise<AGUser> {
    const mentionMember = MentionUtil.getMemberFromMention(guild, mentionText);
    if (!mentionMember) return null;
    const agUser: AGUser = <AGUser>mentionMember.user;
    if (!agUser.isCustomDataLoaded()) await agUser.loadCustomData();
    return agUser;
  }
}

export class RestartCommand extends AbstractCommand {
  constructor() {
    super({
      id: 'Word:Restart',
      command: 'kelimereset',
      description: 'Kelime oyununu sıfırlamak için kullanılır!',
      runIn: ['text', 'dm'],
      requiredBotPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'VIEW_CHANNEL'],
      requiredPermission: CommandPermissions.STAFF,
    });
  }

  run(context: CommandContext): void {
    const wordChannel: Discord.TextChannel = <Discord.TextChannel>(
      context
        .getAGServer()
        .channels.cache.find((channel) => channel.id === this.bot.getConfig().getConfig().channels.word_tr)
    );
    if (!wordChannel) {
      context.getMessage().react('❌');
      context.getMessage().channel.send('Kelime türetme odası belirlenmediği için bu işlemi gerçekleştiremezsiniz!');
      return;
    }
    const configData = this.bot.getConfig().getWordData();
    WordSystem.reset((error: Error) => {
      if (error) {
        context.getMessage().react('❌');
        context.getMessage().channel.send('Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.');
        console.error(error);
        return;
      }
      context.getMessage().react('✅');
      wordChannel.send(
        new Discord.MessageEmbed({
          description: `<@!${
            context.getMessage().member.user.id
          }> adlı yetkili tarafından oyun yeniden başlatıldı.\n\`${configData.lastCharacter.toLocaleUpperCase(
            'tr-TR'
          )}\` ile kelime türetmeye devam edebilirsiniz!`,
          color: '#29c458',
        })
      );
    });
  }
}

export class StatusChangeCommand extends AbstractCommand {
  constructor() {
    super({
      id: 'Word:StatusChange',
      command: 'kelimedurum',
      aliases: ['kelimedurumdegistir'],
      description: 'Kelime oyununu duraklatmak için kullanılır!',
      runIn: ['text', 'dm'],
      requiredBotPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS', 'VIEW_CHANNEL'],
      requiredPermission: CommandPermissions.STAFF,
    });
  }

  run(context: CommandContext): void {
    const wordChannel: Discord.TextChannel = <Discord.TextChannel>(
      context
        .getAGServer()
        .channels.cache.find((channel) => channel.id === this.bot.getConfig().getConfig().channels.word_tr)
    );
    if (!wordChannel) {
      context.getMessage().react('❌');
      context.getMessage().channel.send('Kelime türetme odası belirlenmediği için bu işlemi gerçekleştiremezsiniz!');
      return;
    }
    const currentStatus = this.bot.getConfig().getConfig().word.status;
    const editedStatus = !currentStatus;
    this.bot.getConfig().getConfig().word.status = editedStatus;
    this.bot.getConfig().saveConfig(async (error: Error) => {
      if (error) {
        context.getMessage().react('❌');
        context.getMessage().channel.send('Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.');
        console.error(error);
        return;
      }
      const editedOverwritePermissions: Discord.OverwriteResolvable[] = [];
      for (const overwriteEntry of wordChannel.permissionOverwrites.entries()) {
        const overwrite = overwriteEntry[1];
        if (overwrite.type !== 'role') {
          editedOverwritePermissions.push({
            id: overwrite.id,
            allow: overwrite.allow,
            deny: overwrite.deny,
          });
          continue;
        }
        if (editedStatus) {
          if (overwrite.deny.has('SEND_MESSAGES')) {
            editedOverwritePermissions.push({
              id: overwrite.id,
              allow: overwrite.allow.add('SEND_MESSAGES'),
              deny: overwrite.deny.remove('SEND_MESSAGES'),
            });
          } else {
            editedOverwritePermissions.push({
              id: overwrite.id,
              allow: overwrite.allow,
              deny: overwrite.deny,
            });
          }
        } else {
          if (overwrite.allow.has('SEND_MESSAGES')) {
            editedOverwritePermissions.push({
              id: overwrite.id,
              allow: overwrite.allow.remove('SEND_MESSAGES'),
              deny: overwrite.deny.add('SEND_MESSAGES'),
            });
          } else {
            editedOverwritePermissions.push({
              id: overwrite.id,
              allow: overwrite.allow,
              deny: overwrite.deny,
            });
          }
        }
      }
      await wordChannel.overwritePermissions(editedOverwritePermissions, 'WordGame');
      context.getMessage().react('✅');
      wordChannel.send(
        new Discord.MessageEmbed({
          description: `<@!${context.getMessage().author.id}> adlı yetkili tarafından oyun ${
            editedStatus ? 'başlatıldı' : 'duraklatıldı'
          }.`,
          color: '#29c458',
        })
      );
    });
  }
}
