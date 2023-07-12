import * as Discord from 'discord.js';
import AbstractCommand from '../api/command/AbstractCommand';
import CommandContext from '../api/command/CommandContext';
import CommandPermissions from '../api/command/CommandPermissions';
import MentionUtil from '../api/utils/MentionUtil';

export class ClearCommand extends AbstractCommand {
  constructor() {
    super({
      id: 'Clear',
      command: 'clear',
      description: 'Mesaj temizleme işlemi için kullanılır!',
      runIn: ['text'],
      requiredBotPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'VIEW_CHANNEL'],
      requiredPermission: CommandPermissions.STAFF,
    });
  }

  run(context: CommandContext): void {
    if (context.getArgs().length < 1) {
      context.getMessage().react('❌');
      context
        .getMessage()
        .channel.send(
          `Mesaj temizleme işlemi \n\`${context.getOrganizedPrefix()}${context.getLabel()} silinecek miktar\`\n\`${context.getOrganizedPrefix()}${context.getLabel()} @kullanıcı silinecek miktar\`\n şeklinde olması gerekli!`
        );
      return;
    }
    const mentionedMember = MentionUtil.getMemberFromMention(context.getMessage().guild, context.getArgs()[0]);
    let amount: number;
    if (!mentionedMember) amount = Number(context.getArgs()[0]);
    if (!amount) amount = Number(context.getArgs()[1]);
    if (!amount) return;
    if (isNaN(amount)) {
      context.getMessage().react('❌');
      context
        .getMessage()
        .channel.send(
          `Mesaj temizleme işlemi \n\`${context.getOrganizedPrefix()}${context.getLabel()} silinecek miktar\`\n\`${context.getOrganizedPrefix()}${context.getLabel()} @kullanıcı silinecek miktar\`\n şeklinde olması gerekli!`
        );
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
        if (mentionedMember) messages = messages.filter((message) => message.author.id === mentionedMember.id);
        messages = messages.filter((message) => !message.pinned);
        (<Discord.TextChannel>context.getMessage().channel).bulkDelete(messages).then((messages) => {
          context
            .getMessage()
            .channel.send(
              new Discord.MessageEmbed({
                description: `<@!${context.getMessage().author.id}> adlı yetkili tarafından ${
                  mentionedMember ? `<@!${mentionedMember.id}> adlı fındığa ait` : ''
                } \`${messages.size}\` mesaj silindi!`,
                author: { name: 'AGBot', iconURL: context.getMessage().guild.iconURL() },
                color: '#29c458',
              })
            )
            .then((message) => message.delete({ timeout: 2500 }));
        });
      })
      .catch(() => {});
  }
}
