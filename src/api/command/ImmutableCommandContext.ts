import * as Discord from 'discord.js';
import Bot from '../../Bot';
import Command from './Command';
import CommandContext from './CommandContext';

export default class ImmutableCommandContext implements CommandContext {
  private readonly bot: Bot;
  private readonly message: Discord.Message;
  private readonly command: Command;
  private readonly label: string;
  private readonly prefix: string;
  private readonly args: string[];

  constructor(bot: Bot, message: Discord.Message, command: Command, label: string, prefix: string, args: string[]) {
    this.bot = bot;
    this.message = message;
    this.command = command;
    this.label = label;
    this.prefix = prefix;
    this.args = args;
  }

  getBot(): Bot {
    return this.bot;
  }

  getLabel(): string {
    return this.label;
  }

  getCommand(): Command {
    return this.command;
  }

  getPrefix(): string {
    return this.prefix;
  }

  getOrganizedPrefix(): string {
    return this.prefix.startsWith('<@!') ? this.getBot().getConfig().getConfig().bot.prefix[0] : this.prefix;
  }

  getMessage(): Discord.Message {
    return this.message;
  }

  getAGServer(): Discord.Guild {
    return this.message.guild ? this.message.guild : this.bot.getAGServer();
  }

  getAGMember(): Discord.GuildMember | undefined {
    var agServer = this.getAGServer();
    return agServer === undefined || agServer === null ? null : agServer.members.cache.get(this.getMessage().author.id);
  }

  getAGMemberById(id: string): Discord.GuildMember | undefined {
    var agServer = this.getAGServer();
    return agServer === undefined || agServer === null ? null : agServer.members.cache.get(id);
  }

  isDirectMessage(): boolean {
    return this.getMessage().channel.type === 'dm';
  }

  isGuildText(): boolean {
    return ['text', 'news'].includes(this.getMessage().channel.type);
  }

  reply(...messages: string[]): void {
    this.message.channel.send(messages.join('\n'));
  }

  getArgs(): string[] {
    return this.args;
  }

  getImmutableArgs(): string[] {
    return Object.assign([], this.args);
  }

  clone(newLabel?: string, newArgs?: string[]): CommandContext {
    const newContext = new ImmutableCommandContext(
      this.bot,
      this.message,
      this.command,
      newLabel ? newLabel : this.label,
      this.prefix,
      newArgs ? newArgs : this.args
    );
    return newContext;
  }
}
