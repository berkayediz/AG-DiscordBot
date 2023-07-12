import * as Discord from 'discord.js';
import Command from '../api/command/Command';
import ImmutableCommandContext from '../api/command/ImmutableCommandContext';
import AbstractSubscription from '../api/subscription/AbstractSubscription';

export default class CommandSubscription extends AbstractSubscription {
  constructor() {
    super({
      id: 'Command',
    });
  }

  load(): void {
    this.bot.getClient().on('message', (message) => {
      if (message.guild) {
        if (message.guild.id !== this.bot.getConfig().getConfig().bot.serverId) return;
        if (
          this.bot.getConfig().getConfig().commands.onlyChannels.status &&
          !this.bot.getConfig().getConfig().commands.onlyChannels.data.includes(message.channel.id)
        )
          return;
      }
      if (message.author.bot) return;
      const allPrefix = Object.assign([], this.getBot().getConfig().getConfig().bot.prefix);
      allPrefix.push(`<@!${this.bot.getClient().user.id}> `);
      let prefix = null;
      for (const thisPrefix of allPrefix) {
        if (message.content.startsWith(thisPrefix)) prefix = thisPrefix;
      }
      if (!prefix) return;
      const args: string[] = message.content.slice(prefix.length).trim().split(/ +/);
      const command: string = args.shift().toLowerCase();
      const commandObject: Command = this.getBot().getCommandManager().getCommand(command);
      if (commandObject == null) return;
      commandObject.call(new ImmutableCommandContext(this.bot, message, commandObject, command, prefix, args));
    });
  }

  close(): void {}
}
