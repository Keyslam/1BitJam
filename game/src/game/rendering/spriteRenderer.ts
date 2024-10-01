import { Component } from "../../core/component";
import { Position } from "../common/position";
import { RenderService } from "./renderService";
import { Sprite } from "./sprite";

export class SpriteRenderer extends Component {
	private renderService!: RenderService;

	private position!: Position;

	private _sprite: Sprite | undefined;
	/* prettier-ignore */ public get sprite() { return this._sprite; }
	/* prettier-ignore */ public set sprite(sprite: Sprite | undefined) { this._sprite = sprite; }

	private _isFlipped: boolean;
	/* prettier-ignore */ public get isFlipped() { return this._isFlipped; }
	/* prettier-ignore */ public set isFlipped(isFlipped: boolean) { this._isFlipped = isFlipped; }

	constructor(sprite: Sprite | undefined = undefined, isFlipped: boolean = false) {
		super();

		this._sprite = sprite;
		this._isFlipped = isFlipped;
	}

	public override onFinalize(): void {
		this.renderService = this.injectService(RenderService);

		this.position = this.inject(Position);
	}

	public override onRender() {
		if (!this.sprite) {
			return;
		}

		this.renderService.drawSprite(this.sprite, this.position.x, this.position.y, "background");
	}
}
