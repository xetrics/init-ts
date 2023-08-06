"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilConsole = exports.LOG_LEVEL = void 0;
const chalk_1 = __importDefault(require("chalk"));
var LOG_LEVEL;
(function (LOG_LEVEL) {
    LOG_LEVEL[LOG_LEVEL["VERBOSE"] = 0] = "VERBOSE";
    LOG_LEVEL[LOG_LEVEL["INFO"] = 1] = "INFO";
    LOG_LEVEL[LOG_LEVEL["ERROR"] = 2] = "ERROR";
    LOG_LEVEL[LOG_LEVEL["GRAND"] = 3] = "GRAND";
})(LOG_LEVEL || (exports.LOG_LEVEL = LOG_LEVEL = {}));
class UtilConsole {
    constructor(verboseMode = false) {
        this.verboseMode = verboseMode;
    }
    clear() {
        console.clear();
    }
    verbose(...strings) {
        this.log(LOG_LEVEL.VERBOSE, ...strings, "\n");
    }
    info(...strings) {
        this.log(LOG_LEVEL.INFO, ...strings);
    }
    afterInfo() {
        console.log(chalk_1.default.blue("  \u2713"));
    }
    error(...strings) {
        this.log(LOG_LEVEL.ERROR, "\n", ...strings, "\n");
    }
    grand(...strings) {
        this.log(LOG_LEVEL.GRAND, ...strings);
    }
    success() {
        console.log(chalk_1.default.green("Done! 😊"));
    }
    log(level, ...strings) {
        if (level === LOG_LEVEL.VERBOSE && !this.verboseMode)
            return;
        process.stdout.write(this.formatLevel(level, ...strings));
    }
    formatLevel(level, ...strings) {
        const text = strings.join(" ");
        switch (level) {
            case LOG_LEVEL.VERBOSE:
                return chalk_1.default.white(text);
            case LOG_LEVEL.INFO:
                return chalk_1.default.blue("\u203a " + text);
            case LOG_LEVEL.ERROR:
                return chalk_1.default.red("ERROR: " + text);
            case LOG_LEVEL.GRAND:
                return chalk_1.default.bgBlue(text + " ".repeat(process.stdout.columns - text.length) + "\n");
        }
    }
}
exports.UtilConsole = UtilConsole;
