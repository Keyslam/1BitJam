import { Component } from "../../core/component";
import { AudioService } from "../audio/audioService";
import { Position } from "../common/position";
import { RenderService } from "../rendering/renderService";

export class Text extends Component {
	private font = love.graphics.newFont("assets/tic-80-wide-font.ttf", 6);
	private renderService!: RenderService;
	private audioService!: AudioService;

	private position!: Position;

	private index = 0;

	private t = 0;

	private text = `Your smoking hot girlfriend was taken by the evil wizard, Doodldorf. He's locked her high atop his tower thinking nobody could reach her. Little does Doodldorf know that our protagonist of the story is the prince of jumps, err Jump Prince... uh, maybe Regal Jumper? There's a catchy name in there somewhere. Let's just say he's really good at jumping. A king at it some might say.

The longer our hero charges his jumps (by holding Z), the farther he will go. Additionally he's able to rebound off walls, allowing him to reach platforms that are seemingly impossible to get to.

Jump your way to the top and save the Tower Babe!
[ Press ENTER to continue ]
`;

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
			love.graphics.setFont(this.font);
			love.graphics.printf(actualText, this.position.x - 160 + 13, this.position.y - 90 + 30, 320 - 26, "left");
		}, "foreground");
	}
}
