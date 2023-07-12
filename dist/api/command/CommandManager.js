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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class CommandManager {
    constructor(bot) {
        this.commands = [];
        this.bot = bot;
    }
    getCommand(command) {
        return this.commands.find((cmd) => cmd.command === command || (cmd.aliases != null && cmd.aliases.includes(command)), null);
    }
    register(command) {
        command.setup(this.bot);
        this.commands.push(command);
        command.load();
    }
    registerAll(...commands) {
        commands.forEach((command) => this.commands.push(command));
    }
    async registerPath(_path) {
        const files = await fs.readdirSync(_path);
        for (const file of files) {
            const filePath = path.join(_path, file);
            if ((await fs.statSync(filePath)).isDirectory()) {
                await this.registerPath(filePath);
            }
            else {
                const commandClazzRequire = await Promise.resolve().then(() => __importStar(require(filePath)));
                const commandClazz = commandClazzRequire.default
                    ? commandClazzRequire.default
                    : commandClazzRequire[Object.keys(commandClazzRequire)[0]];
                if (!commandClazz)
                    continue;
                const clazzObject = new commandClazz();
                if (!clazzObject)
                    continue;
                this.register(clazzObject);
                for (const clazzObject of Object.keys(commandClazzRequire).splice(1)) {
                    const commandClazz = commandClazzRequire[clazzObject];
                    if (!commandClazz)
                        continue;
                    this.register(new commandClazz());
                }
            }
        }
    }
    unregister(commandId) {
        const command = this.commands.find((command) => command.id === commandId);
        if (command) {
            command.close();
            this.commands = this.commands.filter((command) => command.id !== commandId);
        }
    }
}
exports.default = CommandManager;
