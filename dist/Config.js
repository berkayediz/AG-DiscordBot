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
const RoleController_1 = __importDefault(require("./api/utils/RoleController"));
class Config {
    constructor() {
        this.roles = new Map();
    }
    load(callback) {
        try {
            this.config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/config.json'), 'utf-8'));
            this.words = {
                tr: JSON.parse(fs.readFileSync(path.join(__dirname, 'config/words_tr.json'), 'utf-8')),
                en: JSON.parse(fs.readFileSync(path.join(__dirname, 'config/words_en.json'), 'utf-8')),
                used: JSON.parse(fs.readFileSync(path.join(__dirname, 'config/words_used.json'), 'utf-8')),
                top: JSON.parse(fs.readFileSync(path.join(__dirname, 'config/words_top.json'), 'utf-8')),
            };
            callback(null);
        }
        catch (error) {
            callback(error);
        }
    }
    saveAll(callback) {
        try {
            fs.writeFileSync(path.join(__dirname, 'config/config.json'), JSON.stringify(this.config, null, 2));
            fs.writeFileSync(path.join(__dirname, 'config/words_used.json'), JSON.stringify(this.words.used, null, 2));
            callback(null);
        }
        catch (error) {
            callback(error);
        }
    }
    saveConfig(callback) {
        try {
            fs.writeFileSync(path.join(__dirname, 'config/config.json'), JSON.stringify(this.config, null, 2));
            callback(null);
        }
        catch (error) {
            callback(error);
        }
    }
    getRoleController(categoryName, reload, setupQueue) {
        if (!this.config.roles[categoryName])
            return null;
        if (reload) {
            return this.roles
                .set(categoryName, new RoleController_1.default(categoryName, Object.assign(this.config.roles[categoryName], []), setupQueue === undefined || setupQueue === null ? true : setupQueue))
                .get(categoryName);
        }
        else {
            if (this.roles.has(categoryName)) {
                return this.roles.get(categoryName).sort();
            }
            else {
                return this.roles
                    .set(categoryName, new RoleController_1.default(categoryName, Object.assign(this.config.roles[categoryName]), setupQueue === undefined || setupQueue === null ? true : setupQueue))
                    .get(categoryName);
            }
        }
    }
    saveWordUsed(callback) {
        try {
            fs.writeFileSync(path.join(__dirname, 'config/words_used.json'), JSON.stringify(this.words.used, null, 2));
            callback(null);
        }
        catch (error) {
            callback(error);
        }
    }
    saveWordTop(callback) {
        try {
            fs.writeFileSync(path.join(__dirname, 'config/words_top.json'), JSON.stringify(this.words.top, null, 2));
            callback(null);
        }
        catch (error) {
            callback(error);
        }
    }
    putUsedWord(message) {
        this.words.used.push(message);
    }
    clearUsedWords() {
        this.words.used = [];
    }
    refreshWordTop(data) {
        this.words.top = data;
    }
    getConfig() {
        return this.config;
    }
    getRoles() {
        return this.roles;
    }
    getAllWords() {
        return this.words;
    }
    getWords(lang) {
        return lang === 'tr' ? this.words.tr : lang === 'en' ? this.words.en : this.words.used;
    }
    getWordTop() {
        return this.words.top;
    }
    getWordData() {
        return this.getConfig().word;
    }
}
exports.default = Config;
