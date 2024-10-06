export interface Color {
	r: number;
	g: number;
	b: number;
	a: number;
}

export const Colors: Record<string, Color> = {
	white: { r: 1, g: 1, b: 1, a: 1 },
	red: { r: 1, g: 0, b: 0, a: 1 },
	green: { r: 0, g: 1, b: 0, a: 1 },
	blue: { r: 0, g: 0, b: 1, a: 1 },
	black: { r: 0, g: 0, b: 0, a: 1 },
	dark: { r: 33 / 255, g: 6 / 255, b: 19 / 255, a: 1 },
};
