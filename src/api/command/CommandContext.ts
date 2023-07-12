import * as Discord from 'discord.js';
import Bot from '../../Bot';
import Command from './Command';

export default interface CommandContext {
  getBot(): Bot;

  getMessage(): Discord.Message;

  getAGServer(): Discord.Guild;

  getAGMember(): Discord.GuildMember | undefined;

  getAGMemberById(id: string): Discord.GuildMember | undefined;

  isDirectMessage(): boolean;

  isGuildText(): boolean;

  getCommand(): Command;

  getLabel(): string;

  getPrefix(): string;

  getOrganizedPrefix(): string;

  reply(...messages: string[]): void;

  getArgs(): string[];

  getImmutableArgs(): string[];

  clone(newLabel?: string, newArgs?: string[]): CommandContext;
}
