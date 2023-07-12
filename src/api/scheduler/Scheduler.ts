import Subscription from '../subscription/Subscription';

export default interface Scheduler extends Subscription {
  active: boolean;
  ms: number;

  start(): void;

  stop(): void;

  call(): void;

  run(): void;

  isActive(): boolean;
}
