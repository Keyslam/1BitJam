import { Environment } from "./environment";
import { createOrUpdateWindowWithSettings, createSaneDefaultWindowSettings, getCurrentWindowSettings, loadWindowSettings, saveWindowSettings } from "./window";

if (Environment.IS_DEBUG) {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	require("lldebugger").start();
}

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
