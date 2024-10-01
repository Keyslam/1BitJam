import { SceneOrchestrator } from "./core/sceneOrchestrator";
import { Environment } from "./environment";
import { createAnimation } from "./game/rendering/animation";
import { report } from "./libraries/lester/lester";
import { start, useLove } from "./libraries/localLuaDebuggerPatcher/localLuaDebuggerPatcher";
import { createOrUpdateWindowWithSettings, createSaneDefaultWindowSettings, getCurrentWindowSettings, loadWindowSettings, saveWindowSettings } from "./window";

if (Environment.IS_DEBUG) {
	useLove();
	start();

	love.errorhandler = (msg) => {
		error(msg, 2);
	};
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
	const sceneOrchestrator = new SceneOrchestrator();

	const load = () => {
		{
			const windowSettings = loadWindowSettings() ?? createSaneDefaultWindowSettings();
			createOrUpdateWindowWithSettings(windowSettings);
		}

		{
			const windowSettings = getCurrentWindowSettings();
			saveWindowSettings(windowSettings);
		}

		const animations = createAnimation("player");
		print(animations["Idle"].frames.length);
	};

	love.run = () => {
		const tickRate = 1 / 60;

		let accumulator: number = 0.0;

		load();

		return () => {
			const dt = love.timer.step();
			accumulator += dt;

			love.event.pump();

			for (const [name, a, b, c, d, e, f] of love.event.poll()) {
				if (name === "quit") {
					return 0;
				}

				// @ts-expect-error No idea how to fix the typing here
				love.handlers[name](a, b, c, d, e, f);
			}

			while (accumulator >= tickRate) {
				sceneOrchestrator.onFixedUpdate();
				accumulator -= tickRate;
			}

			sceneOrchestrator.onUpdate(dt);

			if (love.graphics.isActive()) {
				love.graphics.clear(love.graphics.getBackgroundColor());
				love.graphics.origin();
				const interpolation = accumulator / tickRate;
				sceneOrchestrator.onRender(interpolation);
				love.graphics.present();
			}

			love.timer.sleep(0.001);
		};
	};
}
