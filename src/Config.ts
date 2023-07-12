import * as fs from 'fs';
import * as path from 'path';
import RoleController, { RoleInfo } from './api/utils/RoleController';

export default class Config {
  private config: ConfigType;
  private words: {
    tr: string[];
    en: string[];
    used: string[];
    top: WordSortableData[];
  };
  private roles: Map<string, RoleController> = new Map<string, RoleController>();

  public load(callback: (error: Error) => void) {
    try {
      this.config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/config.json'), 'utf-8'));
      this.words = {
        tr: JSON.parse(fs.readFileSync(path.join(__dirname, 'config/words_tr.json'), 'utf-8')),
        en: JSON.parse(fs.readFileSync(path.join(__dirname, 'config/words_en.json'), 'utf-8')),
        used: JSON.parse(fs.readFileSync(path.join(__dirname, 'config/words_used.json'), 'utf-8')),
        top: JSON.parse(fs.readFileSync(path.join(__dirname, 'config/words_top.json'), 'utf-8')),
      };
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  public saveAll(callback: (error: Error) => void) {
    try {
      fs.writeFileSync(path.join(__dirname, 'config/config.json'), JSON.stringify(this.config, null, 2));
      fs.writeFileSync(path.join(__dirname, 'config/words_used.json'), JSON.stringify(this.words.used, null, 2));
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  public saveConfig(callback: (error: Error) => void) {
    try {
      fs.writeFileSync(path.join(__dirname, 'config/config.json'), JSON.stringify(this.config, null, 2));
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  public getRoleController(categoryName: string, reload?: boolean, setupQueue?: boolean): RoleController | undefined {
    if (!this.config.roles[categoryName]) return null;
    if (reload) {
      return this.roles
        .set(
          categoryName,
          new RoleController(
            categoryName,
            Object.assign(this.config.roles[categoryName], []),
            setupQueue === undefined || setupQueue === null ? true : setupQueue
          )
        )
        .get(categoryName);
    } else {
      if (this.roles.has(categoryName)) {
        return this.roles.get(categoryName).sort();
      } else {
        return this.roles
          .set(
            categoryName,
            new RoleController(
              categoryName,
              Object.assign(this.config.roles[categoryName]),
              setupQueue === undefined || setupQueue === null ? true : setupQueue
            )
          )
          .get(categoryName);
      }
    }
  }

  public saveWordUsed(callback: (error: Error) => void) {
    try {
      fs.writeFileSync(path.join(__dirname, 'config/words_used.json'), JSON.stringify(this.words.used, null, 2));
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  public saveWordTop(callback: (error: Error) => void) {
    try {
      fs.writeFileSync(path.join(__dirname, 'config/words_top.json'), JSON.stringify(this.words.top, null, 2));
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  public putUsedWord(message: string): void {
    this.words.used.push(message);
  }

  public clearUsedWords() {
    this.words.used = [];
  }

  public refreshWordTop(data: WordSortableData[]) {
    this.words.top = data;
  }

  public getConfig(): ConfigType {
    return this.config;
  }

  public getRoles(): Map<String, RoleController> {
    return this.roles;
  }

  public getAllWords(): { tr: string[]; en: string[] } {
    return this.words;
  }

  public getWords(lang: 'tr' | 'en' | 'used'): string[] {
    return lang === 'tr' ? this.words.tr : lang === 'en' ? this.words.en : this.words.used;
  }

  public getWordTop(): WordSortableData[] {
    return this.words.top;
  }

  public getWordData(): { status: boolean; lastCharacter: string; lastUserId: string; limitFinishCount: number } {
    return this.getConfig().word;
  }
}

export type ConfigType = {
  bot: {
    token: string;
    serverId: string;
    ownerId: string;
    prefix: string[];
  };
  roles: {
    [categoryName: string]: [RoleInfo];
  };
  commands: {
    onlyChannels: {
      status: boolean;
      data: string[];
    };
  };
  channels: {
    [id: string]: string;
  };
  word: {
    status: boolean;
    lastCharacter: string;
    lastUserId: string;
    limitFinishCount: number;
  };
};

export type WordSortableData = {
  uniqueId: string;
  value: number;
};
