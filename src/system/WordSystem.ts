import { App } from '../Main';

class WordSystem {
  private status: boolean = true;
  private waitingForWordTyping: boolean = false;

  public control(word: string): boolean {
    return App.getConfig().getWords('tr').includes(word);
  }

  public controlUsed(word: string): boolean {
    return App.getConfig().getWords('used').includes(word);
  }

  public pushUsed(word: string): void {
    App.getConfig().getWords('used').push(word);
  }

  public reset(callback: (error: Error) => void): void {
    this.changeStatus(false);
    App.getConfig().clearUsedWords();
    let alphabet: string[] = 'abcçdefghiıjklmnoöprsştuüvyz'.split('');
    const configData = App.getConfig().getWordData();
    configData.lastCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
    configData.lastUserId = '';
    App.getConfig().saveAll((error: Error) => {
      if (error) {
        callback(error);
        return;
      }
      this.changeStatus(true);
      callback(null);
    });
  }

  public changeStatus(status: boolean): void {
    this.status = status;
  }

  public changeTyping(waitingForWordTyping: boolean): void {
    this.waitingForWordTyping = waitingForWordTyping;
  }

  public isStatus(): boolean {
    return this.status;
  }

  public isTyping(): boolean {
    return this.waitingForWordTyping;
  }
}

export default new WordSystem();
