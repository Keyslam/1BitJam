export interface Viewport {
	x: number;
	y: number;
	width: number;
	height: number;
	originX: number | undefined;
	originY: number | undefined;
}

export interface Sprite {
	image: string;
	viewport: Viewport;
}
