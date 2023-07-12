import * as Discord from 'discord.js';
import * as path from 'path';
import CommandManager from './api/command/CommandManager';
import StructureManager from './api/structure/StructureManager';
import SubscriptionManager from './api/subscription/SubscriptionManager';
import Config from './Config';
import Database from './database/Database';

export default class Bot {
  private client: Discord.Client;
  private config: Config;
  private database: Database;

  private mainFolderPath: string;

  private subscriptionManager: SubscriptionManager;
  private commandManager: CommandManager;

  constructor(config: Config, database: Database) {
    this.config = config;
    this.database = database;
  }

  public async login(callback: (error: Error) => void) {
    await StructureManager.registerPath(path.join(__dirname, 'structures/'));
    this.mainFolderPath = path.join(__dirname, '');
    this.client = new Discord.Client({
      ws: { intents: new Discord.Intents(Discord.Intents.ALL) },
    });
    this.client
      .login(this.config.getConfig().bot.token)
      .then(() => {
        this.subscriptionManager = new SubscriptionManager(this);
        this.commandManager = new CommandManager(this);
        callback(null);
      })
      .catch((error) => callback(error));
  }

  public getAGServer(): Discord.Guild {
    return this.getClient().guilds.cache.get(this.config.getConfig().bot.serverId);
  }

  public getClient(): Discord.Client {
    return this.client;
  }

  public getConfig(): Config {
    return this.config;
  }

  public getDatabase(): Database {
    return this.database;
  }

  public getMainFolderPath(): string {
    return this.mainFolderPath;
  }

  public getSubscriptionManager(): SubscriptionManager {
    return this.subscriptionManager;
  }

  public getCommandManager(): CommandManager {
    return this.commandManager;
  }
}
