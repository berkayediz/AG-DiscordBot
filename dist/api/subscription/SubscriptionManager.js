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
class SubscriptionManager {
    constructor(bot) {
        this.subscriptions = [];
        this.bot = bot;
    }
    register(subscription) {
        subscription.setup(this.bot);
        this.subscriptions.push(subscription);
        subscription.load();
    }
    async registerPath(_path) {
        const files = await fs.readdirSync(_path);
        for (const file of files) {
            const filePath = path.join(_path, file);
            if ((await fs.statSync(filePath)).isDirectory()) {
                await this.registerPath(filePath);
            }
            else {
                const subscriptionClazzRequire = await Promise.resolve().then(() => __importStar(require(filePath)));
                const subscriptionClazz = subscriptionClazzRequire.default
                    ? subscriptionClazzRequire.default
                    : subscriptionClazzRequire[Object.keys(subscriptionClazzRequire)[0]];
                if (!subscriptionClazz)
                    continue;
                const clazzObject = new subscriptionClazz();
                if (!clazzObject)
                    continue;
                this.register(clazzObject);
                for (const clazzObject of Object.keys(subscriptionClazzRequire).splice(1)) {
                    const subscriptionClazz = subscriptionClazzRequire[clazzObject];
                    if (!subscriptionClazz)
                        continue;
                    this.register(new subscriptionClazz());
                }
            }
        }
    }
    registerAll(...subscriptions) {
        subscriptions.forEach((subscription) => this.register(subscription));
    }
    unregister(subscriptionId) {
        const subscription = this.subscriptions.find((subscription) => subscription.id === subscriptionId);
        if (subscription) {
            subscription.close();
            this.subscriptions = this.subscriptions.filter((subscription) => subscription.id !== subscriptionId);
        }
    }
}
exports.default = SubscriptionManager;
