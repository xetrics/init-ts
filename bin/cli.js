"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCli = void 0;
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const chalk_1 = __importDefault(require("chalk"));
const create_project_1 = require("./create-project");
function initCli() {
    (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .wrap(yargs_1.default.terminalWidth())
        .command("$0 [options]", "creates a barebones typescript project", (yargs) => {
        return yargs.options({
            name: {
                alias: "n",
                type: "string",
                description: chalk_1.default.dim("Name of your project"),
            },
            // dryRun: {
            // 	alias: "d",
            // 	type: "boolean",
            // 	description: chalk.dim("Don't create files"),
            // },
            help: {
                alias: "h",
                description: chalk_1.default.dim("Show help"),
            },
            verbose: {
                alias: "v",
                type: "boolean",
                description: chalk_1.default.dim("Enables verbose logging"),
            },
        });
    }, (argv) => {
        (0, create_project_1.createProject)(argv.name, argv.verbose);
    })
        .version(false)
        .parse();
}
exports.initCli = initCli;
