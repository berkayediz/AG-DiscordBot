"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = __importDefault(require("../api/command/AbstractCommand"));
class TestCommand extends AbstractCommand_1.default {
    constructor() {
        super({
            id: 'Test',
            command: 'test',
            description: 'Test command',
        });
    }
    run(context) { }
}
exports.default = TestCommand;
