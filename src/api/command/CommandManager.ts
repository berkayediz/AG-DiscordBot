import * as fs from 'fs';
import * as path from 'path';
import Bot from '../../Bot';
import Command from './Command';

export default class CommandManager {
  private bot: Bot;
  private commands: Command[] = [];

  constructor(bot: Bot) {
    this.bot = bot;
  }

  public getCommand(command: string): Command {
    return this.commands.find(
      (cmd) => cmd.command === command || (cmd.aliases != null && cmd.aliases.includes(command)),
      null
    );
  }

  public register(command: Command): void {
    command.setup(this.bot);
    this.commands.push(command);
    command.load();
  }

  public registerAll(...commands: Command[]): void {
    commands.forEach((command) => this.commands.push(command));
  }

  public async registerPath(_path: string): Promise<void> {
    const files = await fs.readdirSync(_path);
    for (const file of files) {
      const filePath = path.join(_path, file);
      if ((await fs.statSync(filePath)).isDirectory()) {
        await this.registerPath(filePath);
      } else {
        const commandClazzRequire = await import(filePath);
        const commandClazz = commandClazzRequire.default
          ? commandClazzRequire.default
          : commandClazzRequire[Object.keys(commandClazzRequire)[0]];
        if (!commandClazz) continue;
        const clazzObject = new commandClazz();
        if (!clazzObject) continue;
        this.register(clazzObject as Command);
        for (const clazzObject of Object.keys(commandClazzRequire).splice(1)) {
          const commandClazz = commandClazzRequire[clazzObject];
          if (!commandClazz) continue;
          this.register(new commandClazz() as Command);
        }
      }
    }
  }

  public unregister(commandId: string): void {
    const command = this.commands.find((command) => command.id === commandId);
    if (command) {
      command.close();
      this.commands = this.commands.filter((command) => command.id !== commandId);
    }
  }
}
