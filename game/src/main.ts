import { Scene } from "./core/scene";
import { SceneOrchestrator } from "./core/sceneOrchestrator";
import { Environment } from "./environment";
import { AudioService } from "./game/audio/audioService";
import { ResourceService } from "./game/common/resourceService";
import { LevelLoaderService } from "./game/levels/levelLoaderService";
import { TilemapService } from "./game/levels/tilemapService";
import { CameraService } from "./game/rendering/cameraService";
import { RenderService } from "./game/rendering/renderService";
import { ScheduleService } from "./game/scheduling/scheduleService";
import { report } from "./libraries/lester/lester";
import { start, useLove } from "./libraries/localLuaDebuggerPatcher/localLuaDebuggerPatcher";
import { createOrUpdateWindowWithSettings, createSaneDefaultWindowSettings, getCurrentWindowSettings, loadWindowSettings, saveWindowSettings } from "./window";

// eslint-disable-next-line @typescript-eslint/no-require-imports
_G.ldtk = require("libraries/ldtk/ldtk");

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
	love.graphics.setDefaultFilter("nearest", "nearest");
	love.graphics.setLineStyle("rough");

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

		const scene = new Scene( //
			new CameraService(),
			new RenderService(320, 180),
			new ResourceService(),
			new LevelLoaderService(),
			new TilemapService(),
			new ScheduleService(),
			new AudioService(),
		);

		sceneOrchestrator.loadScene(scene);
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
				sceneOrchestrator.onGui(interpolation);
				love.graphics.present();
			}

			love.timer.sleep(0.001);
		};
	};
}
