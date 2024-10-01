import { Canvas, DrawMode } from "love.graphics";
import { Service } from "../../core/service";
import { Color } from "./color";
import { Sprite } from "./sprite";
import { ResourceService } from "../common/resourceService";

export type RenderLayer = "background" | "foreground";

export class RenderService extends Service {
	private resourceService!: ResourceService;

	private resolutionX: number;
	private resolutionY: number;
	private canvas: Canvas;

	private backgroundBuffer: (() => void)[] = [];
	private foregroundBuffer: (() => void)[] = [];

	constructor(resolutionX: number, resolutionY: number) {
		super();

		this.resolutionX = resolutionX;
		this.resolutionY = resolutionY;
		this.canvas = love.graphics.newCanvas(resolutionX, resolutionY);
	}

	public override onFinalize(): void {
		this.resourceService = this.inject(ResourceService);
	}

	private getBuffer(renderLayer: RenderLayer): (() => void)[] {
		switch (renderLayer) {
			case "background":
				return this.backgroundBuffer;
			case "foreground":
				return this.foregroundBuffer;
		}
	}

	public drawPoint(x: number, y: number, renderLayer: RenderLayer, color: Color): void {
		this.getBuffer(renderLayer).push(() => {
			love.graphics.setColor(color.r, color.g, color.b, color.a);
			love.graphics.points(x + 0.5, y + 0.5);
		});
	}

	public drawLine(x1: number, y1: number, x2: number, y2: number, renderLayer: RenderLayer, color: Color): void {
		this.getBuffer(renderLayer).push(() => {
			love.graphics.setColor(color.r, color.g, color.b, color.a);
			love.graphics.line(x1 + 0.5, y1 + 0.5, x2 - 0.5, y2 - 0.5);
		});
	}

	public drawRectangle(x: number, y: number, width: number, height: number, renderLayer: RenderLayer, color: Color, mode: DrawMode = "line"): void {
		this.getBuffer(renderLayer).push(() => {
			love.graphics.setColor(color.r, color.g, color.b, color.a);
			love.graphics.rectangle(mode, x + 0.5, y + 0.5, width - 1, height - 1);
		});
	}

	public drawSprite(sprite: Sprite, x: number, y: number, renderLayer: RenderLayer): void {
		this.getBuffer(renderLayer).push(() => {
			love.graphics.setColor(1, 1, 1, 1);

			const image = this.resourceService.getImage(sprite.image);

			const quad = love.graphics.newQuad(sprite.viewport.x, sprite.viewport.y, sprite.viewport.width, sprite.viewport.height, image);
			love.graphics.draw(image, quad, x, y);
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postGui(interpolation: number): void {
		love.graphics.setCanvas(this.canvas);
		love.graphics.clear(0, 0, 0, 0);

		for (const backgroundOperation of this.backgroundBuffer) {
			backgroundOperation();
		}

		for (const foregroundOperation of this.foregroundBuffer) {
			foregroundOperation();
		}

		this.backgroundBuffer = [];
		this.foregroundBuffer = [];

		love.graphics.setCanvas();

		const { scaleFactor, offsetX, offsetY } = this.getScaleAndOffset();
		love.graphics.setColor(1, 1, 1, 1);
		love.graphics.draw(this.canvas, offsetX, offsetY, 0, scaleFactor, scaleFactor);
	}

	private getScaleAndOffset(): { scaleFactor: number; offsetX: number; offsetY: number } {
		const [width, height] = love.graphics.getDimensions();

		const scaleFactor = Math.min(Math.floor(width / this.resolutionX), Math.floor(height / this.resolutionY));

		const offsetX = (width - this.resolutionX * scaleFactor) / 2;
		const offsetY = (height - this.resolutionY * scaleFactor) / 2;

		return {
			scaleFactor,
			offsetX,
			offsetY,
		};
	}
}
