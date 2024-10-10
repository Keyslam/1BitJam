import { decode, encode } from "./libraries/json/json";

const windowSettingsFilePath = "settings.json";

export interface WindowSettings {
	width: number;
	height: number;

	vsyncEnabled: boolean;
}

export function loadWindowSettings(): WindowSettings | undefined {
	try {
		const [serializedWindowSettings] = love.filesystem.read(windowSettingsFilePath);

		if (serializedWindowSettings === undefined) {
			return undefined;
		}

		const deserializedWindowSettings = decode(serializedWindowSettings) as WindowSettings;

		return deserializedWindowSettings;
	} catch {
		// TODO Validate deserialized data
		return undefined;
	}
}

export function saveWindowSettings(windowSettings: WindowSettings): boolean {
	const serializedWindowSettings = encode(windowSettings);

	const [success, message] = love.filesystem.write(windowSettingsFilePath, serializedWindowSettings);

	if (!success) {
		// TODO Gracefully handle errors
		print(message);
	}

	return success;
}

export function getCurrentWindowSettings(): WindowSettings {
	const [width, height, flags] = love.window.getMode();

	return {
		width: width,
		height: height,
		vsyncEnabled: flags.vsync ?? false,
	};
}

export function createSaneDefaultWindowSettings(): WindowSettings {
	const [screenWidth, screenHeight] = love.window.getDesktopDimensions();

	// TODO Pick width & height based on aspect ratio

	return {
		width: screenWidth * 0.7,
		height: screenHeight * 0.7,
		vsyncEnabled: true,
	};
}

export function createOrUpdateWindowWithSettings(windowSettings: WindowSettings): void {
	love.window.setMode(windowSettings.width, windowSettings.height, {
		vsync: windowSettings.vsyncEnabled,

		display: 0,
		msaa: 0,
		fullscreen: false,
		borderless: false,
		resizable: true,
		usedpiscale: undefined,
	});

	love.window.setTitle("Tower Babe");
	love.window.setIcon(love.image.newImageData("assets/icon.png"));
}
