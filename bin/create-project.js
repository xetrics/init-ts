"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_child_process_1 = require("node:child_process");
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const globby_1 = require("@cjs-exporter/globby");
const util_console_1 = require("./util-console");
const askName = () => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield inquirer_1.default.prompt([
        {
            message: chalk_1.default.white("Project name:"),
            name: "name",
            type: "string",
        },
    ]);
    return answers;
});
function createProject(name, verboseMode) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = new util_console_1.UtilConsole(!!verboseMode);
        // prompt name if not provided
        if (!name) {
            logger.verbose("Name argument not found");
            const answer = yield askName();
            name = answer.name;
            if (!name) {
                logger.error("Name is required.");
                process.exit(1);
            }
        }
        logger.grand(` Initilizing new project '${name}'!`);
        // check & create project directory
        const projectPath = node_path_1.default.join(process.cwd(), name);
        const pathExists = yield fs_extra_1.default.pathExists(projectPath);
        if (pathExists) {
            logger.error(`Path '${projectPath}' already exists.`);
            process.exit(1);
        }
        else {
            logger.info("Creating file structure... ");
            yield fs_extra_1.default.ensureDir(node_path_1.default.join(projectPath, "src")).catch(() => {
                logger.error(`Failed to create file structure.`);
                process.exit(1);
            });
            logger.afterInfo();
        }
        // init project
        logger.info("Initializing NPM...");
        try {
            logger.verbose("Running 'npm init -y'");
            (0, node_child_process_1.execSync)("npm init -y", { cwd: projectPath });
            logger.verbose("Updating scripts");
            const packageObj = yield fs_extra_1.default.readJson(node_path_1.default.join(projectPath, "package.json"));
            const scriptsObj = {
                dev: "nodemon src/index.ts",
                build: "npm run lint && rimraf build/ && tsc",
                start: "npm run build && node build/index.js",
                test: 'echo "Error: no test specified" && exit 1',
                lint: "eslint src/**/*.ts",
            };
            packageObj.scripts = scriptsObj;
            yield fs_extra_1.default.writeJson(node_path_1.default.join(projectPath, "package.json"), packageObj, { spaces: "\t" });
        }
        catch (e) {
            logger.verbose(e);
            logger.error("Failed to initialize NPM.");
            process.exit(1);
        }
        logger.afterInfo();
        // copy configuration
        logger.info("Copying configuration...");
        try {
            const to_copy = yield (0, globby_1.globby)(node_path_1.default.join(__dirname, "../src/files/*"));
            yield Promise.all(to_copy.map((file, i) => __awaiter(this, void 0, void 0, function* () {
                logger.verbose(`Copying '${file}' (${i + 1}/${to_copy.length})`);
                let file_name = file.split("/").reverse()[0];
                const isDotFile = file_name.includes(".dotfile");
                file_name = file_name.split(".").slice(0, -1).join(".");
                if (isDotFile)
                    file_name = "." + file_name;
                yield fs_extra_1.default.copy(file, node_path_1.default.join(projectPath, file_name));
            })));
        }
        catch (e) {
            logger.verbose(e);
            logger.error("Failed to copy configuration files.");
            process.exit(1);
        }
        logger.afterInfo();
        // install dependencies
        logger.info("Installing dependencies... ");
        const dev_dependencies = [
            "typescript",
            "ts-node",
            "rimraf",
            "prettier",
            "nodemon",
            "eslint",
            "eslint-config-prettier",
            "eslint-plugin-prettier",
            "@typescript-eslint/parser",
            "@typescript-eslint/eslint-plugin",
            "@types/node",
        ];
        try {
            (0, node_child_process_1.execSync)(`npm install --save-dev ${dev_dependencies.join(" ")}`, { cwd: projectPath });
        }
        catch (e) {
            logger.verbose(e);
            logger.error("Failed to install project dependencies.");
            process.exit(1);
        }
        logger.afterInfo();
        // create index.ts
        logger.info("Finishing...");
        yield fs_extra_1.default.writeFile(node_path_1.default.join(projectPath, "src/index.ts"), `console.log("Hello World!");`);
        process.stdout.write("\n");
        logger.success();
    });
}
exports.createProject = createProject;
