import CommandContext from './CommandContext';

export default interface CommandPermission {
  test(context: CommandContext): Promise<void>;
}
