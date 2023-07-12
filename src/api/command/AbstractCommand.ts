import { PermissionString } from 'discord.js';
import Bot from '../../Bot';
import Command, { RunIn } from './Command';
import CommandContext from './CommandContext';
import CommandError from './CommandError';
import CommandPermission from './CommandPermission';

export default abstract class AbstractCommand implements Command {
  bot: Bot;
  id: string;
  command: string;
  aliases?: string[];
  description: string;
  runIn: RunIn[] = ['text', 'dm'];
  requiredBotPermissions: PermissionString[];
  requiredPermission: CommandPermission;

  constructor(args: {
    id: string;
    command: string;
    aliases?: string[];
    description: string;
    runIn?: RunIn[];
    requiredBotPermissions?: PermissionString[];
    requiredPermission?: CommandPermission;
  }) {
    this.id = args.id;
    this.command = args.command;
    if (!(args.aliases === undefined || args.aliases === null)) this.aliases = args.aliases;
    this.description = args.description;
    if (args.runIn) this.runIn = args.runIn;
    if (args.requiredBotPermissions) this.requiredBotPermissions = args.requiredBotPermissions;
    if (args.requiredPermission) this.requiredPermission = args.requiredPermission;
  }

  public call(context: CommandContext): void {
    const currentChannelType: 'text' | 'dm' =
      context.getMessage().channel.type === 'news' ? 'text' : (context.getMessage().channel.type as 'text' | 'dm');
    if (!this.runIn.includes(currentChannelType)) {
      context.getMessage().channel.send('Bu komutu burada kullanamazsın!');
      return;
    }
    if (this.requiredBotPermissions.length > 0 && context.getMessage().guild) {
      for (const permission of this.requiredBotPermissions) {
        if (!context.getMessage().guild.me.hasPermission(permission)) return;
      }
    }
    if (this.requiredPermission) {
      try {
        this.requiredPermission.test(context);
      } catch (error) {
        if (error instanceof CommandError) {
          context.getMessage().channel.send(error.message);
          console.log(error);
          return;
        }
      }
    }
    this.run(context);
  }

  abstract run(context: CommandContext): void;

  public load(): void {}

  public setup(bot: Bot): void {
    this.bot = bot;
  }

  public close(): void {}

  public getBot(): Bot {
    return this.bot;
  }
}
