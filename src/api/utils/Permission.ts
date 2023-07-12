import * as Discord from 'discord.js';
import { App } from '../../Main';

export default class Permission {
  public static isOwner(member: Discord.GuildMember): boolean {
    return member.guild.ownerID === member.id;
  }

  public static anyRole(member: Discord.GuildMember, roleCategoryName: string): boolean {
    const roleController = App.getConfig().getRoleController(roleCategoryName);
    if (!roleController) return false;
    return member.guild.roles.cache.some((role) => roleController.getRoles().some((cRole) => cRole.id === role.id));
  }

  public static containsRole(member: Discord.GuildMember, roleCategoryName: string, roleName: string): boolean {
    const roleController = App.getConfig().getRoleController(roleCategoryName);
    if (!roleController) return false;
    const roleInfo = roleController.getRoleWithName(roleName);
    if (!roleInfo) return false;
    const role = member.guild.roles.cache.find((role) => role.id === roleInfo.id);
    if (role == null) return false;
    return this.containsRoleBasic(member, role);
  }

  public static containsRoleBasic(member: Discord.GuildMember, role: Discord.Role): boolean {
    return member.roles.cache.some((fRole) => fRole.id === role.id);
  }

  public static getQueue(member: Discord.GuildMember, roleCategoryName: string): number {
    const roleController = App.getConfig().getRoleController(roleCategoryName);
    if (!roleController) return -1;
    const roles = roleController.getRoles();
    let queue = -1;
    const isStaff = member.roles.cache.some((role) =>
      roles.some((roleInfo) => {
        if (roleInfo.id === role.id) {
          queue = roleInfo.queue;
          return true;
        }
        return false;
      })
    );
    if (!isStaff) return -1;
    return queue;
  }
}
