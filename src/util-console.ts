import chalk from "chalk";

export enum LOG_LEVEL {
	VERBOSE,
	INFO,
	ERROR,
	GRAND,
}

export class UtilConsole {
	constructor(private verboseMode: boolean = false) {}

	clear() {
		console.clear();
	}

	verbose(...strings: string[]) {
		this.log(LOG_LEVEL.VERBOSE, ...strings, "\n");
	}

	info(...strings: string[]) {
		this.log(LOG_LEVEL.INFO, ...strings);
	}

	afterInfo() {
		console.log(chalk.blue("  \u2713"));
	}

	error(...strings: string[]) {
		this.log(LOG_LEVEL.ERROR, "\n", ...strings, "\n");
	}

	grand(...strings: string[]) {
		this.log(LOG_LEVEL.GRAND, ...strings);
	}

	success() {
		console.log(chalk.green("Done! 😊"));
	}

	private log(level: LOG_LEVEL, ...strings: string[]) {
		if (level === LOG_LEVEL.VERBOSE && !this.verboseMode) return;
		process.stdout.write(this.formatLevel(level, ...strings));
	}

	private formatLevel(level: LOG_LEVEL, ...strings: string[]) {
		const text = strings.join(" ");
		switch (level) {
			case LOG_LEVEL.VERBOSE:
				return chalk.white(text);
			case LOG_LEVEL.INFO:
				return chalk.blue("\u203a " + text);
			case LOG_LEVEL.ERROR:
				return chalk.red("ERROR: " + text);
			case LOG_LEVEL.GRAND:
				return chalk.bgBlue(text + " ".repeat(process.stdout.columns - text.length) + "\n");
		}
	}
}
