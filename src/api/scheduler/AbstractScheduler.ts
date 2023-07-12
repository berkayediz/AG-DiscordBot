import moment from 'moment';
import Bot from '../../Bot';
import Scheduler from './Scheduler';

export default abstract class AbstractScheduler implements Scheduler {
  bot: Bot;
  id: string;
  active: boolean;
  ms: number;

  private process: NodeJS.Timeout;

  constructor(args: { id: string; ms: number | moment.Duration }) {
    this.id = args.id;
    if (args.ms) {
      if ((args.ms as moment.Duration).asMilliseconds) {
        this.ms = (args.ms as moment.Duration).asMilliseconds();
      } else {
        this.ms = args.ms as number;
      }
    }
  }

  public start(): void {
    this.process = setInterval(() => {
      this.call();
    }, this.ms);
  }

  public stop(): void {
    clearInterval(this.process);
  }

  public call(): void {
    this.run();
  }

  abstract run(): void;

  public load(): void {
    this.start();
  }

  public setup(bot: Bot): void {
    this.bot = bot;
  }

  public close(): void {
    this.stop();
  }

  public getBot(): Bot {
    return this.bot;
  }

  public isActive(): boolean {
    return this.active;
  }
}
