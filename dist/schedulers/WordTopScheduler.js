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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const moment_1 = __importDefault(require("moment"));
const AbstractScheduler_1 = __importDefault(require("../api/scheduler/AbstractScheduler"));
class WordTopScheduler extends AbstractScheduler_1.default {
    constructor() {
        super({
            id: 'WordTop',
            ms: moment_1.default.duration(60, 'seconds'),
        });
    }
    run() {
        const userFolderPath = path.join(this.bot.getMainFolderPath(), 'users/');
        if (!fs.existsSync(userFolderPath))
            return;
        const allUserFiles = fs.readdirSync(userFolderPath);
        let elements = [];
        for (const userFile of allUserFiles) {
            const data = JSON.parse(fs.readFileSync(path.join(userFolderPath, userFile), 'utf-8'));
            elements.push({
                uniqueId: userFile.replace(/\.json$/, ''),
                value: data.wordPoint,
            });
        }
        elements = elements.sort((a, b) => b.value - a.value);
        this.bot.getConfig().refreshWordTop(elements.slice(0, 10));
        this.bot.getConfig().saveWordTop(() => { });
    }
}
exports.default = WordTopScheduler;
