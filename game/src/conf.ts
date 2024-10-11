import { Config } from "love";

love.conf = (config: Config) => {
	config.identity = "TowerBabe";
	config.version = "11.5";

	config.console = true;

	// @ts-expect-error We create the window later
	config.window = undefined;

	config.modules.audio = true;
	config.modules.data = false;
	config.modules.event = true;
	config.modules.font = true;
	config.modules.graphics = true;
	config.modules.image = true;
	config.modules.joystick = true;
	config.modules.keyboard = true;
	config.modules.math = true;
	config.modules.mouse = true;
	config.modules.physics = false;
	config.modules.sound = true;
	config.modules.system = false;
	config.modules.thread = false;
	config.modules.timer = true;
	config.modules.touch = false;
	config.modules.video = false;
	config.modules.window = true;
};
