import path from "node:path";
import { execSync } from "node:child_process";
import fs from "fs-extra";
import chalk from "chalk";
import inquirer from "inquirer";
import { globby } from "@cjs-exporter/globby";
import { UtilConsole } from "./util-console";

const askName = async () => {
	const answers = await inquirer.prompt([
		{
			message: chalk.white("Project name:"),
			name: "name",
			type: "string",
		},
	]);

	return answers;
};

export async function createProject(name: string | undefined, verboseMode?: boolean | undefined) {
	const logger = new UtilConsole(!!verboseMode);

	// prompt name if not provided
	if (!name) {
		logger.verbose("Name argument not found");
		const answer = await askName();
		name = answer.name;

		if (!name) {
			logger.error("Name is required.");
			process.exit(1);
		}
	}

	logger.grand(` Initilizing new project '${name}'!`);

	// check & create project directory
	const projectPath = path.join(process.cwd(), name);
	const pathExists = await fs.pathExists(projectPath);

	if (pathExists) {
		logger.error(`Path '${projectPath}' already exists.`);
		process.exit(1);
	} else {
		logger.info("Creating file structure... ");

		await fs.ensureDir(path.join(projectPath, "src")).catch(() => {
			logger.error(`Failed to create file structure.`);
			process.exit(1);
		});

		logger.afterInfo();
	}

	// init project
	logger.info("Initializing NPM...");
	try {
		logger.verbose("Running 'npm init -y'");
		execSync("npm init -y", { cwd: projectPath });

		logger.verbose("Updating scripts");
		const packageObj = await fs.readJson(path.join(projectPath, "package.json"));

		const scriptsObj = {
			dev: "nodemon src/index.ts",
			build: "npm run lint && rimraf build/ && tsc",
			start: "npm run build && node build/index.js",
			test: 'echo "Error: no test specified" && exit 1',
			lint: "eslint src/**/*.ts",
		};

		packageObj.scripts = scriptsObj;

		await fs.writeJson(path.join(projectPath, "package.json"), packageObj, { spaces: "\t" });
	} catch (e) {
		logger.verbose(e as string);
		logger.error("Failed to initialize NPM.");
		process.exit(1);
	}
	logger.afterInfo();

	// copy configuration
	logger.info("Copying configuration...");
	try {
		const to_copy = await globby(path.join(__dirname, "../src/files/*"));

		await Promise.all(
			to_copy.map(async (file, i) => {
				logger.verbose(`Copying '${file}' (${i + 1}/${to_copy.length})`);

				let file_name = file.split("/").reverse()[0];
				const isDotFile = file_name.includes(".dotfile");
				file_name = file_name.split(".").slice(0, -1).join(".");
				if (isDotFile) file_name = "." + file_name;

				await fs.copy(file, path.join(projectPath, file_name));
			})
		);
	} catch (e) {
		logger.verbose(e as string);
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
		execSync(`npm install --save-dev ${dev_dependencies.join(" ")}`, { cwd: projectPath });
	} catch (e) {
		logger.verbose(e as string);
		logger.error("Failed to install project dependencies.");
		process.exit(1);
	}

	logger.afterInfo();

	// create index.ts
	logger.info("Finishing...");
	await fs.writeFile(path.join(projectPath, "src/index.ts"), `console.log("Hello World!");`);
	process.stdout.write("\n");

	logger.success();
}
