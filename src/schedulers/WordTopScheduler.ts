import * as fs from 'fs';
import * as path from 'path';
import moment from 'moment';
import AbstractScheduler from '../api/scheduler/AbstractScheduler';
import { WordSortableData } from '../Config';

export default class WordTopScheduler extends AbstractScheduler {
  constructor() {
    super({
      id: 'WordTop',
      ms: moment.duration(60, 'seconds'),
    });
  }

  run(): void {
    const userFolderPath = path.join(this.bot.getMainFolderPath(), 'users/');
    if (!fs.existsSync(userFolderPath)) return;
    const allUserFiles = fs.readdirSync(userFolderPath);
    let elements: WordSortableData[] = [];
    for (const userFile of allUserFiles) {
      const data = JSON.parse(fs.readFileSync(path.join(userFolderPath, userFile), 'utf-8'));
      elements.push({
        uniqueId: userFile.replace(/\.json$/, ''),
        value: data.wordPoint,
      });
    }
    elements = elements.sort((a, b) => b.value - a.value);
    this.bot.getConfig().refreshWordTop(elements.slice(0, 10));
    this.bot.getConfig().saveWordTop(() => {});
  }
}
