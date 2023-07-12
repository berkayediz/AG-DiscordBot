import * as fs from 'fs';
import * as path from 'path';

class StructureManager {
  public async registerPath(_path: string): Promise<void> {
    const files = await fs.readdirSync(_path);
    for (const file of files) {
      const filePath = path.join(_path, file);
      if ((await fs.statSync(filePath)).isDirectory()) {
        this.registerPath(filePath);
      } else {
        await import(filePath);
      }
    }
  }
}

export default new StructureManager();
