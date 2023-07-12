import * as Discord from 'discord.js';
import AGUser, { AGCustomData } from '../api/user/AGUser';

declare module 'discord.js' {
  class AGUser extends Discord.User {
    private customData: AGCustomData | undefined;

    public loadCustomData(callback: (error: Error) => void): void;

    public saveCustomData(callback: (error: Error) => void): void;

    public increaseWp(value: number): void;

    public decreaseWp(value: number): void;

    public clearWp(): void;

    public setWp(value: number): void;

    public isCustomDataLoaded(): boolean;

    public getCustomData(): AGCustomData;
  }
}

Discord.Structures.extend('User', () => {
  return AGUser;
});
