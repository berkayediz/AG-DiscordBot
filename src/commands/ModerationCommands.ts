import AbstractCommand from '../api/command/AbstractCommand';
import CommandContext from '../api/command/CommandContext';
import CommandPermissions from '../api/command/CommandPermissions';
import MentionUtil from '../api/utils/MentionUtil';
import Permission from '../api/utils/Permission';

export class WarnCommand extends AbstractCommand {
  constructor() {
    super({
      id: 'Warn',
      command: 'warn',
      description: 'Belirtilen fındığı uyarır',
      runIn: ['text'],
      requiredBotPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES', 'BAN_MEMBERS'],
      requiredPermission: CommandPermissions.STAFF_WITH_QUEUE(1),
    });
  }
  async run(context: CommandContext): Promise<void> {
    if (context.getArgs().length < 1) {
      context.getMessage().react('❌');
      context
        .getMessage()
        .channel.send(
          'Uyarı işlemi `' +
            context.getOrganizedPrefix() +
            context.getLabel() +
            ' @kullanıcı sebep` şeklinde olması gerekli!'
        );
      return;
    }
    const mentionedMember = MentionUtil.getMemberFromMention(context.getMessage().guild, context.getArgs()[0]);
    if (!mentionedMember) {
      context.getMessage().react('❌');
      context
        .getMessage()
        .channel.send(
          'Uyarı işlemi `' +
            context.getOrganizedPrefix() +
            context.getLabel() +
            ' @kullanıcı sebep` şeklinde olması gerekli!'
        );
      return;
    }
    if (context.getMessage().author.id === mentionedMember.id) {
      context.getMessage().react('❌');
      context.getMessage().channel.send('Kendini uyaramazsın *-*');
      return;
    }
    if (mentionedMember.user.bot) {
      context.getMessage().react('❌');
      context.getMessage().channel.send('Başka bir botu uyarmam ne kadar mantıklı bilemiyorum *-*');
      return;
    }
    if (mentionedMember.user.id === context.getBot().getClient().user.id) {
      context.getMessage().react('❌');
      context.getMessage().channel.send('Kendimi uyarmamı mı bekliyorsun cidden *-*');
      return;
    }
    const mentionedMemberIsOwner = Permission.isOwner(mentionedMember);
    if (mentionedMemberIsOwner) {
      context.getMessage().react('❌');
      context
        .getMessage()
        .channel.send(
          'Sunucu sahibini uyarma fikri cidden çok değişik! Bu düşüncelerden kendini alıkoymanı öneririm...'
        );
      return;
    }
    const mentionedMemberStaffQueue = Permission.getQueue(mentionedMember, 'staff');
    if (mentionedMemberStaffQueue > 0) {
      context.getMessage().react('❌');
      context
        .getMessage()
        .channel.send(
          'Sunucu yetkilisini uyarma fikri cidden çok değişik! Bu düşüncelerden kendini alıkoymanı öneririm...'
        );
      return;
    }
    const reason = context.getArgs().slice(1).join(' ');
    const warnQueue = Permission.getQueue(mentionedMember, 'warn');
    const warnRoleController = context.getBot().getConfig().getRoleController('warn', false, false);
    let status = false;
    let warn = 0;
    if (warnQueue < 0) {
      warn = 1;
      await mentionedMember.roles.add(warnRoleController.getRoleWithName('Warn1').id);
      status = true;
    }
    if (warnQueue === 1) {
      warn = 2;
      await mentionedMember.roles.remove(warnRoleController.getRoleWithName('Warn1').id);
      await mentionedMember.roles.add(warnRoleController.getRoleWithName('Warn2').id);
      status = true;
    }
    if (warnQueue === 2) {
      warn = 3;
      await mentionedMember.roles.remove(warnRoleController.getRoleWithName('Warn2').id);
      await mentionedMember.roles.add(warnRoleController.getRoleWithName('Warn3').id);
      status = true;
    }
    if (warnQueue === 3) {
      await mentionedMember.ban({
        reason: reason,
      });
      context.getMessage().react('✅');
      context
        .getMessage()
        .channel.send(
          `<@${mentionedMember.id}> adlı fındık, <@${
            context.getMessage().author.id
          }> adlı yetkili tarafından uyarıldı (\`4. Uyarı\`). Maksimum uyarı puanına ulaştığı için sunucudan yasaklandı!`
        );
      return;
    }
    if (status) {
      context.getMessage().react('✅');
      context
        .getMessage()
        .channel.send(
          `<@${mentionedMember.id}> adlı fındık, <@${
            context.getMessage().author.id
          }> adlı yetkili tarafından uyarıldı (\`${warn}. Uyarı\`).`
        );
    }
  }
}
