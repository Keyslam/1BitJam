import { Service } from "../../core/service";

export class AudioService extends Service {
	public playSound(soundName: string) {
		const source = love.audio.newSource(`assets/sfx/${soundName}.ogg`, "stream");
		source.play();
	}
}
