import * as Discord from 'discord.js';
import AbstractCommand from '../api/command/AbstractCommand';
import CommandContext from '../api/command/CommandContext';
import CommandPermissions from '../api/command/CommandPermissions';
import MentionUtil from '../api/utils/MentionUtil';
import NumberUtil from '../api/utils/NumberUtil';

export default class SlowModeCommand extends AbstractCommand {
  constructor() {
    super({
      id: 'SlowMode',
      command: 'slowmode',
      description: 'Belirli odanın slowmode özelliğini ayarlar.',
      runIn: ['text'],
      requiredBotPermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
      requiredPermission: CommandPermissions.STAFF,
    });
  }
  run(context: CommandContext): void {
    if (context.getArgs().length < 2) {
      const channel: Discord.TextChannel = <Discord.TextChannel>context.getMessage().channel;
      if (!NumberUtil.isNumeric(context.getArgs()[0])) {
        context.getMessage().react('❌');
        context.getMessage().channel.send('Belirttiğiniz sayı hatalı!');
        return;
      }
      channel.setRateLimitPerUser(parseInt(context.getArgs()[0]));
      context.getMessage().react('✅');
    } else {
      const channel: Discord.TextChannel = <Discord.TextChannel>(
        MentionUtil.getChannelFromMention(context.getMessage().guild, context.getArgs()[0])
      );
      if (!channel) {
        context.getMessage().react('❌');
        context.getMessage().channel.send('Belirttiğiniz odaya ulaşamadım!');
        return;
      }
      if (!NumberUtil.isNumeric(context.getArgs()[1])) {
        context.getMessage().react('❌');
        context.getMessage().channel.send('Belirttiğiniz sayı hatalı!');
        return;
      }
      channel.setRateLimitPerUser(parseInt(context.getArgs()[1]));
      context.getMessage().react('✅');
    }
  }
}
