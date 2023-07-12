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
const Discord = __importStar(require("discord.js"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class AGUser extends Discord.User {
    constructor(client, data) {
        super(client, data);
    }
    async loadCustomData() {
        const filePath = path.join(__dirname, `../../users/${this.id}.json`);
        const dir = path.dirname(filePath).normalize();
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        if (!fs.existsSync(filePath)) {
            this.customData = this.createEmptyCustomData();
            fs.writeFileSync(filePath, JSON.stringify(this.customData, null, 2));
        }
        else {
            const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            this.customData = fileData;
        }
    }
    async saveCustomData() {
        const filePath = path.join(__dirname, `../../users/${this.id}.json`);
        const dir = path.dirname(filePath).normalize();
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(this.customData === undefined ? this.createEmptyCustomData() : this.customData, null, 2));
    }
    createEmptyCustomData() {
        return {
            name: this.username + '#' + this.discriminator,
            wordPoint: 0,
        };
    }
    increaseWp(value) {
        if (!this.isCustomDataLoaded())
            throw new Error('Özel bilgiler yüklenmemiş!');
        if (value < 0)
            throw new Error('Arttırma işleminde kullanılacak değer `0`\'dan küçük olamaz!');
        this.getCustomData().wordPoint = this.getCustomData().wordPoint + value;
    }
    decreaseWp(value) {
        if (!this.isCustomDataLoaded())
            throw new Error('Özel bilgiler yüklenmemiş!');
        if (value < 0)
            throw new Error('Eksiltme işleminde kullanılacak değer `0`\'dan küçük olamaz!');
        if ((this.getCustomData().wordPoint - value) < 0)
            throw new Error('Eksitme işleminden sonraki değer `0`\'dan küçük olamaz!');
        this.getCustomData().wordPoint = this.getCustomData().wordPoint - value;
    }
    clearWp() {
        if (!this.isCustomDataLoaded())
            throw new Error('Özel bilgiler yüklenmemiş!');
        this.getCustomData().wordPoint = 0;
    }
    setWp(value) {
        if (!this.isCustomDataLoaded())
            throw new Error('Özel bilgiler yüklenmemiş!');
        if (value < 0)
            throw new Error('Belirlenecek değer `0`\'dan küçük olamaz!');
        this.getCustomData().wordPoint = value;
    }
    isCustomDataLoaded() {
        return this.getCustomData() !== undefined;
    }
    getCustomData() {
        return this.customData;
    }
}
exports.default = AGUser;
