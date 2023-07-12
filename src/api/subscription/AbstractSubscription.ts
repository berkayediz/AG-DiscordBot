import Bot from '../../Bot';
import Subscription from './Subscription';

export default abstract class AbstractSubscription implements Subscription {
  bot: Bot;
  id: string;

  constructor(args: { id: string }) {
    this.id = args.id;
  }

  abstract load(): void;

  public setup(bot: Bot): void {
    this.bot = bot;
  }

  abstract close(): void;

  public getBot(): Bot {
    return this.bot;
  }
}
