export interface RoleInfo {
  id: string;
  name: string;
  queue?: number;
}

export default class RoleController {
  private categoryName: string;
  private roles: Array<RoleInfo> = [];

  constructor(categoryName: string, roles: RoleInfo[], setupQueue?: boolean) {
    this.categoryName = categoryName;
    this.roles = roles;
    if (setupQueue) {
      var queue = roles.length;
      this.roles.forEach((role) => (role.queue = queue--));
    }
    this.sort();
  }

  public reverse(): RoleController {
    this.roles = this.roles.reverse();
    return this;
  }

  public sort(): RoleController {
    this.roles = this.roles.sort((roleA, roleB) => {
      if (!roleA.queue) roleA.queue = 0;
      if (!roleB.queue) roleB.queue = 0;
      if (roleA.queue > roleB.queue) {
        return 1;
      } else if (roleA.queue < roleB.queue) {
        return -1;
      }

      return 0;
    });
    return this;
  }

  public getRoleWithId(id: string): RoleInfo {
    return this.roles.find((role) => role.id === id);
  }

  public getRoleWithName(name: string): RoleInfo {
    return this.roles.find((role) => role.name === name);
  }

  public hasRole(role: RoleInfo): boolean {
    return this.roles.some((sRole) => sRole.id === role.id);
  }

  public getQueue(role: RoleInfo): number {
    return this.roles.find((sRole) => sRole.id === role.id).queue;
  }

  public getCategoryName(): string {
    return this.categoryName;
  }

  public getRoles(): Array<RoleInfo> {
    return this.roles;
  }
}
