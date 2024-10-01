import { decode } from "../../libraries/json/json";
import { Sprite } from "./sprite";

export interface Frame {
	sprite: Sprite;
	duration: number;
}

export interface Animation {
	frames: Frame[];
	playback: "loop" | "freeze";
}

interface AsepriteFrameData {
	frames: Record<
		string,
		{
			frame: { x: number; y: number; w: number; h: number };
			spriteSourceSize: { x: number; y: number; w: number; h: number };
			duration: number;
		}
	>;
	meta: {
		image: string;
		size: { w: number; h: number };
		frameTags: {
			name: string;
			from: number;
			to: number;
		}[];
	};
}

export function createAnimation(file: string): Record<string, Animation> {
	const animations: Record<string, Animation> = {};

	const [serializedData] = love.filesystem.read(`assets/${file}.json`);
	if (serializedData === undefined) {
		throw new Error(`Couldn't load file '${file}'`);
	}

	const data = decode(serializedData) as AsepriteFrameData;

	const image = love.graphics.newImage(`assets/${data.meta.image}`);

	for (const frameTag of data.meta.frameTags) {
		
		const frames: Frame[] = [];
		const frameCount = frameTag.to - frameTag.from;

		for (let i = 0; i < frameCount; i++) {
			const frameData = data.frames[`${frameTag.name}_${i}`];

			const frame: Frame = {
				sprite: new Sprite(
					image,
					{
						x: frameData.spriteSourceSize.x,
						y: frameData.spriteSourceSize.y,
						width: frameData.spriteSourceSize.w,
						height: frameData.spriteSourceSize.h,
						originX: frameData.spriteSourceSize.w / 2,
						originY: frameData.spriteSourceSize.h / 2,
					},
					false,
				),
				duration: frameData.duration,
			};

			frames.push(frame);
		}

		const animation: Animation = {
			frames: frames,
			playback: "loop",
		};

		animations[frameTag.name] = animation;
	}

	return animations;
}
