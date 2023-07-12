import * as fs from 'fs';
import * as path from 'path';
import Bot from '../../Bot';
import Subscription from './Subscription';

export default class SubscriptionManager {
  private bot: Bot;
  private subscriptions: Subscription[] = [];

  constructor(bot: Bot) {
    this.bot = bot;
  }

  public register(subscription: Subscription) {
    subscription.setup(this.bot);
    this.subscriptions.push(subscription);
    subscription.load();
  }

  public async registerPath(_path: string): Promise<void> {
    const files = await fs.readdirSync(_path);
    for (const file of files) {
      const filePath = path.join(_path, file);
      if ((await fs.statSync(filePath)).isDirectory()) {
        await this.registerPath(filePath);
      } else {
        const subscriptionClazzRequire = await import(filePath);
        const subscriptionClazz = subscriptionClazzRequire.default
          ? subscriptionClazzRequire.default
          : subscriptionClazzRequire[Object.keys(subscriptionClazzRequire)[0]];
        if (!subscriptionClazz) continue;
        const clazzObject = new subscriptionClazz();
        if (!clazzObject) continue;
        this.register(clazzObject as Subscription);
        for (const clazzObject of Object.keys(subscriptionClazzRequire).splice(1)) {
          const subscriptionClazz = subscriptionClazzRequire[clazzObject];
          if (!subscriptionClazz) continue;
          this.register(new subscriptionClazz() as Subscription);
        }
      }
    }
  }

  public registerAll(...subscriptions: Subscription[]) {
    subscriptions.forEach((subscription) => this.register(subscription));
  }

  public unregister(subscriptionId: string): void {
    const subscription = this.subscriptions.find((subscription) => subscription.id === subscriptionId);
    if (subscription) {
      subscription.close();
      this.subscriptions = this.subscriptions.filter((subscription) => subscription.id !== subscriptionId);
    }
  }
}
