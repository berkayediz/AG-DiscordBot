"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Permission_1 = __importDefault(require("../utils/Permission"));
const CommandError_1 = __importDefault(require("./CommandError"));
class CommandPermissions {
    static STAFF_WITH_QUEUE(minQueue) {
        return {
            test: async (context) => {
                let guild;
                if (context.isDirectMessage())
                    guild = context.getAGServer();
                else
                    guild = context.getMessage().guild;
                const member = context.isDirectMessage()
                    ? guild.members.cache.get(context.getMessage().author.id)
                    : context.getMessage().member;
                if (member === undefined || member === null)
                    throw new CommandError_1.default('Bu komutu sadece Anıl Güler sunucusunda olanlar kullanabilir!');
                var queue = Permission_1.default.getQueue(member, 'staff');
                if (!(guild.ownerID === member.id ||
                    member.hasPermission('ADMINISTRATOR') ||
                    member.hasPermission('MANAGE_GUILD') ||
                    (queue !== -1 && queue < minQueue))) {
                    throw new CommandError_1.default('Bu komutu sadece sunucu yetkilisi kullanabilir!');
                }
            },
        };
    }
}
exports.default = CommandPermissions;
CommandPermissions.USER = {
    test: async () => { },
};
CommandPermissions.BOT_OWNER = {
    test: async (context) => {
        if (context.getMessage().author.id !== context.getBot().getConfig().getConfig().bot.ownerId) {
            throw new CommandError_1.default('Bu komutu sadece bot sahibi kullanabilir!');
        }
    },
};
CommandPermissions.OWNER = {
    test: async (context) => {
        let guild;
        if (context.isDirectMessage()) {
            guild = context.getAGServer();
            if (!guild.members.cache.some((member) => member.id === context.getMessage().author.id))
                throw new CommandError_1.default('Bu komutu sadece Anıl Güler sunucusunda olanlar kullanabilir!');
        }
        else
            guild = context.getMessage().guild;
        if (guild.ownerID !== context.getMessage().author.id) {
            throw new CommandError_1.default('Bu komutu sadece sunucu sahibi kullanabilir!');
        }
    },
};
CommandPermissions.STAFF = {
    test: async (context) => {
        let guild;
        if (context.isDirectMessage())
            guild = context.getAGServer();
        else
            guild = context.getMessage().guild;
        const member = context.isDirectMessage()
            ? guild.members.cache.get(context.getMessage().author.id)
            : context.getMessage().member;
        if (member === undefined || member === null)
            throw new CommandError_1.default('Bu komutu sadece Anıl Güler sunucusunda olanlar kullanabilir!');
        if (!(guild.ownerID === member.id ||
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('MANAGE_GUILD') ||
            Permission_1.default.anyRole(member, 'staff'))) {
            throw new CommandError_1.default('Bu komutu sadece sunucu yetkilisi kullanabilir!');
        }
    },
};
