import { Source } from "love.audio";
import { Service } from "../../core/service";

export class AudioService extends Service {
	public playSound(soundName: string, variation: boolean = false) {
		const source = love.audio.newSource(`assets/sfx/${soundName}.ogg`, "stream");

		if (variation) {
			source.setPitch(1 + love.math.random() * 0.1);
		}
		source.play();
	}

	public playTrack(trackName: string): Source {
		const source = love.audio.newSource(`assets/track/${trackName}.ogg`, "stream");
		source.setVolume(0.7);
		source.setLooping(true);
		source.play();

		return source;
	}
}
