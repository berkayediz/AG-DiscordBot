import AbstractCommand from '../api/command/AbstractCommand';
import CommandContext from '../api/command/CommandContext';

export default class TestCommand extends AbstractCommand {
  constructor() {
    super({
      id: 'Test',
      command: 'test',
      description: 'Test command',
    });
  }
  run(context: CommandContext): void {}
}
