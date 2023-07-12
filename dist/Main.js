"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const path = __importStar(require("path"));
const Bot_1 = __importDefault(require("./Bot"));
const Config_1 = __importDefault(require("./Config"));
const Database_1 = __importDefault(require("./database/Database"));
let app;
exports.App = app;
const config = new Config_1.default();
const database = new Database_1.default();
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
        exports.App = app = new Bot_1.default(config, database);
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
process.on('unhandledRejection', (error, promise) => {
    console.log('Unhandled rejection at ', promise, `reason: ${error.message}`);
});
process.on('uncaughtException', (error) => {
    console.log('Uncaught exception', `reason: ${error.message}`);
    console.error(error);
    process.exit(1);
});
