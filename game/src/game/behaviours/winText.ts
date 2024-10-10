import { Component } from "../../core/component";
import { AudioService } from "../audio/audioService";
import { Position } from "../common/position";
import { RenderService } from "../rendering/renderService";

export class WinText extends Component {
	private winscreen = love.graphics.newImage("assets/winscreen.png");
	private font = love.graphics.newFont("assets/tic-80-wide-font.ttf", 6);
	private renderService!: RenderService;
	private audioService!: AudioService;

	private position!: Position;

	private index = 0;

	private t = 0;

	private text = `Thank you for saving me!






















	...How do we get down?`;

	public onFinalize(): void {
		this.renderService = this.injectService(RenderService);
		this.audioService = this.injectService(AudioService);

		this.position = this.inject(Position);
	}

	public onFixedUpdate(): void {
		if (this.index === this.text.length) {
			return;
		}

		this.t = this.t + 1;

		if (this.t >= 3) {
			this.t -= 3;

			this.index++;

			const letter = this.text.substring(this.index - 1, this.index);

			if (letter !== " " && letter !== "\n" && letter !== "\r") {
				this.audioService.playSound("click", true);
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public onRender(interpolation: number): void {
		const actualText = this.text.substring(0, this.index);

		this.renderService.drawLambda(() => {
			love.graphics.setColor(1, 1, 1, 1);
			love.graphics.draw(this.winscreen, -300, -180);

			love.graphics.setFont(this.font);
			love.graphics.printf(actualText, this.position.x - 314, this.position.y - 160, 320 - 26, "left");
		}, "foreground");
	}
}
