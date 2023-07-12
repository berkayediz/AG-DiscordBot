import * as sqlite3 from 'sqlite3';
import * as path from 'path';

export default class Database {
  private database: sqlite3.Database;

  public connect(callback: (error: Error) => void) {
    this.database = new (sqlite3.verbose().Database)(
      path.join(__dirname, 'data.db'),
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (error: Error) => {
        if (error) callback(error);
        else callback(null);
      }
    );
  }

  public getDatabase(): sqlite3.Database {
    return this.database;
  }
}
