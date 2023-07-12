"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoleController {
    constructor(categoryName, roles, setupQueue) {
        this.roles = [];
        this.categoryName = categoryName;
        this.roles = roles;
        if (setupQueue) {
            var queue = roles.length;
            this.roles.forEach((role) => (role.queue = queue--));
        }
        this.sort();
    }
    reverse() {
        this.roles = this.roles.reverse();
        return this;
    }
    sort() {
        this.roles = this.roles.sort((roleA, roleB) => {
            if (!roleA.queue)
                roleA.queue = 0;
            if (!roleB.queue)
                roleB.queue = 0;
            if (roleA.queue > roleB.queue) {
                return 1;
            }
            else if (roleA.queue < roleB.queue) {
                return -1;
            }
            return 0;
        });
        return this;
    }
    getRoleWithId(id) {
        return this.roles.find((role) => role.id === id);
    }
    getRoleWithName(name) {
        return this.roles.find((role) => role.name === name);
    }
    hasRole(role) {
        return this.roles.some((sRole) => sRole.id === role.id);
    }
    getQueue(role) {
        return this.roles.find((sRole) => sRole.id === role.id).queue;
    }
    getCategoryName() {
        return this.categoryName;
    }
    getRoles() {
        return this.roles;
    }
}
exports.default = RoleController;
