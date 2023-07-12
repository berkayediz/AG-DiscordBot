import { PermissionString } from 'discord.js';
import Subscription from '../subscription/Subscription';
import CommandContext from './CommandContext';
import CommandPermission from './CommandPermission';

export default interface Command extends Subscription {
  command: string;
  aliases?: string[];
  description: string;
  runIn: RunIn[];
  requiredBotPermissions: PermissionString[];
  requiredPermission: CommandPermission;

  call(context: CommandContext): void;

  run(context: CommandContext): void;
}

export type RunIn = 'text' | 'dm';
