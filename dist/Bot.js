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
const Discord = __importStar(require("discord.js"));
const path = __importStar(require("path"));
const CommandManager_1 = __importDefault(require("./api/command/CommandManager"));
const StructureManager_1 = __importDefault(require("./api/structure/StructureManager"));
const SubscriptionManager_1 = __importDefault(require("./api/subscription/SubscriptionManager"));
class Bot {
    constructor(config, database) {
        this.config = config;
        this.database = database;
    }
    async login(callback) {
        await StructureManager_1.default.registerPath(path.join(__dirname, 'structures/'));
        this.mainFolderPath = path.join(__dirname, '');
        this.client = new Discord.Client({
            ws: { intents: new Discord.Intents(Discord.Intents.ALL) },
        });
        this.client
            .login(this.config.getConfig().bot.token)
            .then(() => {
            this.subscriptionManager = new SubscriptionManager_1.default(this);
            this.commandManager = new CommandManager_1.default(this);
            callback(null);
        })
            .catch((error) => callback(error));
    }
    getAGServer() {
        return this.getClient().guilds.cache.get(this.config.getConfig().bot.serverId);
    }
    getClient() {
        return this.client;
    }
    getConfig() {
        return this.config;
    }
    getDatabase() {
        return this.database;
    }
    getMainFolderPath() {
        return this.mainFolderPath;
    }
    getSubscriptionManager() {
        return this.subscriptionManager;
    }
    getCommandManager() {
        return this.commandManager;
    }
}
exports.default = Bot;
