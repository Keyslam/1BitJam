import { Image } from "love.graphics";

export interface Viewport {
	x: number;
	y: number;
	width: number;
	height: number;
	originX: number | undefined;
	originY: number | undefined;
}

export interface Sprite {
	image: Image | string;
	viewport: Viewport | undefined;
}
