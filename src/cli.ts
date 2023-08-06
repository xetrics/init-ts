import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { createProject } from "./create-project";

export function initCli() {
	yargs(hideBin(process.argv))
		.wrap(yargs.terminalWidth())
		.command(
			"$0 [options]",
			"creates a barebones typescript project",
			(yargs) => {
				return yargs.options({
					name: {
						alias: "n",
						type: "string",
						description: chalk.dim("Name of your project"),
					},
					// dryRun: {
					// 	alias: "d",
					// 	type: "boolean",
					// 	description: chalk.dim("Don't create files"),
					// },
					help: {
						alias: "h",
						description: chalk.dim("Show help"),
					},
					verbose: {
						alias: "v",
						type: "boolean",
						description: chalk.dim("Enables verbose logging"),
					},
				});
			},
			(argv) => {
				createProject(argv.name, argv.verbose);
			}
		)
		.version(false)
		.parse();
}
