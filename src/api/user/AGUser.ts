import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

export type AGCustomData = {
  name: string;
  wordPoint: number;
};

export default class AGUser extends Discord.User {
  private customData: AGCustomData | undefined;

  constructor(client: Discord.Client, data: object) {
    super(client, data);
  }

  public async loadCustomData(): Promise<void> {
    const filePath = path.join(__dirname, `../../users/${this.id}.json`);
    const dir = path.dirname(filePath).normalize();
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(filePath)) {
      this.customData = this.createEmptyCustomData();
      fs.writeFileSync(filePath, JSON.stringify(this.customData, null, 2));
    } else {
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      this.customData = fileData;
    }
  }

  public async saveCustomData(): Promise<void> {
    const filePath = path.join(__dirname, `../../users/${this.id}.json`);
    const dir = path.dirname(filePath).normalize();
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      filePath,
      JSON.stringify(this.customData === undefined ? this.createEmptyCustomData() : this.customData, null, 2)
    );
  }

  private createEmptyCustomData(): AGCustomData {
    return {
      name: this.username + '#' + this.discriminator,
      wordPoint: 0,
    };
  }

  public increaseWp(value: number): void {
    if (!this.isCustomDataLoaded()) throw new Error('Özel bilgiler yüklenmemiş!');
    if (value < 0) throw new Error('Arttırma işleminde kullanılacak değer `0`\'dan küçük olamaz!');
    this.getCustomData().wordPoint = this.getCustomData().wordPoint + value;
  }

  public decreaseWp(value: number): void {
    if (!this.isCustomDataLoaded()) throw new Error('Özel bilgiler yüklenmemiş!');
    if (value < 0) throw new Error('Eksiltme işleminde kullanılacak değer `0`\'dan küçük olamaz!');
    if ((this.getCustomData().wordPoint - value) < 0) throw new Error('Eksitme işleminden sonraki değer `0`\'dan küçük olamaz!');
    this.getCustomData().wordPoint = this.getCustomData().wordPoint - value;
  }

  public clearWp(): void {
    if (!this.isCustomDataLoaded()) throw new Error('Özel bilgiler yüklenmemiş!');
    this.getCustomData().wordPoint = 0;
  }

  public setWp(value: number): void {
    if (!this.isCustomDataLoaded()) throw new Error('Özel bilgiler yüklenmemiş!');
    if (value < 0) throw new Error('Belirlenecek değer `0`\'dan küçük olamaz!');
    this.getCustomData().wordPoint = value;
  }

  public isCustomDataLoaded(): boolean {
    return this.getCustomData() !== undefined;
  }

  public getCustomData(): AGCustomData {
    return this.customData;
  }
}
