import { Component } from "../../core/component";
import { Event } from "../../core/event";
import { Position } from "../common/position";
import { TilemapService } from "../levels/tilemapService";
import { Colors } from "../rendering/color";
import { RenderService } from "../rendering/renderService";
import { BoundingBox } from "./boundingBox";

export class Body extends Component {
	private tilemapService!: TilemapService;
	private renderService!: RenderService;

	private position!: Position;

	private remainderX = 0;
	private remainderY = 0;

	private _boundingBox: BoundingBox;
	/* prettier-ignore */ public get boundingBox() { return this._boundingBox; }
	/* prettier-ignore */ private set boundingBox(boundingBox: BoundingBox) { this._boundingBox = boundingBox; }

	private _ignoreOneWay: boolean = false;
	/* prettier-ignore */ public get ignoreOneWay() { return this._ignoreOneWay; }
	/* prettier-ignore */ public set ignoreOneWay(ignoreOneWay: boolean) { this._ignoreOneWay = ignoreOneWay; }

	public onCollision = new Event<{ x: number; y: number }>();

	constructor(boundingBox: BoundingBox) {
		super();

		this._boundingBox = boundingBox;
	}

	public override onFinalize(): void {
		this.tilemapService = this.injectService(TilemapService);
		this.renderService = this.injectService(RenderService);

		this.position = this.inject(Position);
	}

	public override onRender() {
		const draw = false;
		if (draw) {
			const x = this.position.x + this.boundingBox.left;
			const y = this.position.y + this.boundingBox.top;
			const width = this.position.x + this.boundingBox.right - x;
			const height = this.position.y + this.boundingBox.bottom - y;

			this.renderService.drawRectangle(x, y, width, height, "foreground", Colors.red, "line");
		}
	}

	public moveX(amount: number): void {
		this.remainderX += amount;

		let moveX = Math.round(this.remainderX);

		if (moveX !== 0) {
			this.remainderX -= moveX;
			const sign = Math.sign(moveX);

			while (moveX !== 0) {
				const targetX = this.position.x + sign;

				const result = this.canMoveX(this.boundingBox, targetX, this.position.y);
				if (result.canMove) {
					this.position.x = targetX;
					this.position.y += result.offsetY;
					moveX -= sign;
				} else {
					this.onCollision.emit({ x: sign, y: 0 });
					return;
				}
			}
		}
	}

	public moveY(amount: number): void {
		this.remainderY += amount;

		let moveY = Math.round(this.remainderY);

		if (moveY !== 0) {
			this.remainderY -= moveY;
			const sign = Math.sign(moveY);

			while (moveY !== 0) {
				const targetY = this.position.y + sign;

				const result = this.canMoveY(this.boundingBox, this.position.x, targetY);
				if (result.canMove) {
					this.position.x += result.offsetX;
					this.position.y = targetY;
					moveY -= sign;
				} else {
					this.onCollision.emit({ x: 0, y: sign });
					return;
				}
			}
		}
	}

	private canMoveX(boundingBox: BoundingBox, targetX: number, targetY: number): { canMove: boolean; offsetY: number } {
		if (this.tilemapService.query(boundingBox, targetX, targetY)) {
			return { canMove: true, offsetY: 0 };
		}

		if (this.tilemapService.query(boundingBox, targetX, targetY - 1)) {
			return { canMove: true, offsetY: -1 };
		}

		if (this.tilemapService.query(boundingBox, targetX, targetY + 1)) {
			return { canMove: true, offsetY: 1 };
		}

		return { canMove: false, offsetY: 0 };
	}

	private canMoveY(boundingBox: BoundingBox, targetX: number, targetY: number): { canMove: boolean; offsetX: number } {
		if (this.tilemapService.query(boundingBox, targetX, targetY)) {
			return { canMove: true, offsetX: 0 };
		}

		if (this.tilemapService.query(boundingBox, targetX - 1, targetY)) {
			return { canMove: true, offsetX: -1 };
		}

		if (this.tilemapService.query(boundingBox, targetX + 1, targetY)) {
			return { canMove: true, offsetX: 1 };
		}

		return { canMove: false, offsetX: 0 };
	}
}
