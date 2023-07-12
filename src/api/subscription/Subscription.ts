import Bot from '../../Bot';

export default interface Subscription {
  bot: Bot;
  id: string;

  load(): void;

  setup(bot: Bot): void;

  close(): void;

  getBot(): Bot;
}
