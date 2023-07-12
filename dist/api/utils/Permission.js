"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("../../Main");
class Permission {
    static isOwner(member) {
        return member.guild.ownerID === member.id;
    }
    static anyRole(member, roleCategoryName) {
        const roleController = Main_1.App.getConfig().getRoleController(roleCategoryName);
        if (!roleController)
            return false;
        return member.guild.roles.cache.some((role) => roleController.getRoles().some((cRole) => cRole.id === role.id));
    }
    static containsRole(member, roleCategoryName, roleName) {
        const roleController = Main_1.App.getConfig().getRoleController(roleCategoryName);
        if (!roleController)
            return false;
        const roleInfo = roleController.getRoleWithName(roleName);
        if (!roleInfo)
            return false;
        const role = member.guild.roles.cache.find((role) => role.id === roleInfo.id);
        if (role == null)
            return false;
        return this.containsRoleBasic(member, role);
    }
    static containsRoleBasic(member, role) {
        return member.roles.cache.some((fRole) => fRole.id === role.id);
    }
    static getQueue(member, roleCategoryName) {
        const roleController = Main_1.App.getConfig().getRoleController(roleCategoryName);
        if (!roleController)
            return -1;
        const roles = roleController.getRoles();
        let queue = -1;
        const isStaff = member.roles.cache.some((role) => roles.some((roleInfo) => {
            if (roleInfo.id === role.id) {
                queue = roleInfo.queue;
                return true;
            }
            return false;
        }));
        if (!isStaff)
            return -1;
        return queue;
    }
}
exports.default = Permission;
