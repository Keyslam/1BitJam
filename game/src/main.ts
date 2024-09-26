import { Environment } from "./environment";
import { report } from "./libraries/lester/lester";
import { createOrUpdateWindowWithSettings, createSaneDefaultWindowSettings, getCurrentWindowSettings, loadWindowSettings, saveWindowSettings } from "./window";

if (Environment.IS_DEBUG) {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	require("lldebugger").start();
}

if (Environment.IS_TEST) {
	const findSpecFiles = (directory: string, specFiles: string[]): string[] => {
		const items = love.filesystem.getDirectoryItems(directory);

		for (const item of items) {
			const fullPath = `${directory}/${item}`;
			if (love.filesystem.getInfo(fullPath, "directory")) {
				findSpecFiles(fullPath, specFiles);
			} else if (string.match(item, "%-spec%.lua$")[0] !== undefined) {
				specFiles.push(fullPath);
			}
		}

		return specFiles;
	};

	for (const specFile of findSpecFiles("", [])) {
		const [chunk, errormsg] = love.filesystem.load(specFile);
		if (chunk === undefined) {
			throw new Error(errormsg);
		}

		chunk();
	}

	report();
	love.event.quit();
} else {
	{
		const windowSettings = loadWindowSettings() ?? createSaneDefaultWindowSettings();
		createOrUpdateWindowWithSettings(windowSettings);
	}

	{
		const windowSettings = getCurrentWindowSettings();
		saveWindowSettings(windowSettings);
	}

	love.draw = () => {
		love.graphics.print("Hello world!");
	};
}
