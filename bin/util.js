"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilConsole = exports.LOG_LEVEL = void 0;
var LOG_LEVEL;
(function (LOG_LEVEL) {
    LOG_LEVEL[LOG_LEVEL["VERBOSE"] = 0] = "VERBOSE";
    LOG_LEVEL[LOG_LEVEL["INFO"] = 1] = "INFO";
    LOG_LEVEL[LOG_LEVEL["ERROR"] = 2] = "ERROR";
    LOG_LEVEL[LOG_LEVEL["GRAND"] = 3] = "GRAND";
})(LOG_LEVEL || (exports.LOG_LEVEL = LOG_LEVEL = {}));
class UtilConsole {
}
exports.UtilConsole = UtilConsole;
