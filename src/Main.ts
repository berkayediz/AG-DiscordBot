import * as path from 'path';
import Bot from './Bot';
import Config from './Config';
import Database from './database/Database';

let app: Bot;
const config = new Config();
const database = new Database();
database.connect((error) => {
  if (error) {
    console.log(error.stack);
    process.exit(1);
  }
  config.load((error) => {
    if (error) {
      console.log(error.stack);
      process.exit(1);
    }
    app = new Bot(config, database);
    app.login((error) => {
      if (error) {
        console.log(error.stack);
        process.exit(1);
      }
      app.getSubscriptionManager().registerPath(path.join(app.getMainFolderPath(), 'subscriptions/'));
      app.getSubscriptionManager().registerPath(path.join(app.getMainFolderPath(), 'schedulers/'));
      app.getCommandManager().registerPath(path.join(app.getMainFolderPath(), 'commands/'));
      console.log('Login successfully! ' + app.getClient().user.username + '@' + app.getClient().user.id);
    });
  });
});

process.on('unhandledRejection', (error: Error, promise: any) => {
  console.log('Unhandled rejection at ', promise, `reason: ${error.message}`);
});

process.on('uncaughtException', (error: Error) => {
  console.log('Uncaught exception', `reason: ${error.message}`);
  console.error(error);
  process.exit(1);
});

export { app as App };
