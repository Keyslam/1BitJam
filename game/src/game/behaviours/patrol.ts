import { Component } from "../../core/component";
import { Position } from "../common/position";
import { TilemapService } from "../levels/tilemapService";
import { Body } from "../physics/body";
import { BoundingBox } from "../physics/boundingBox";
import { Velocity } from "../physics/velocity";
import { SpriteRenderer } from "../rendering/spriteRenderer";

export class Patrol extends Component {
	private tilemapService!: TilemapService;

	private position!: Position;
	private velocity!: Velocity;
	private body!: Body;
	private spriteRenderer!: SpriteRenderer;

	private speed: number;
	private direction: "left" | "right" = "right";
	public active: boolean = true;

	constructor(speed: number) {
		super();

		this.speed = speed;
	}

	public override onFinalize(): void {
		this.tilemapService = this.injectService(TilemapService);

		this.body = this.inject(Body);
		this.position = this.inject(Position);
		this.velocity = this.inject(Velocity);
		this.spriteRenderer = this.inject(SpriteRenderer);

		this.body.onCollision.subscribe((payload) => this.onCollision(payload));
	}

	public override onFixedUpdate(): void {
		if (!this.active) {
			this.velocity.x = 0;
			return;
		}

		const rightFeetSensor: BoundingBox = {
			top: this.body.boundingBox.bottom,
			bottom: this.body.boundingBox.bottom + 1,
			left: this.body.boundingBox.right,
			right: this.body.boundingBox.right + 1,
		};

		const leftFeetSensor: BoundingBox = {
			top: this.body.boundingBox.bottom,
			bottom: this.body.boundingBox.bottom + 1,
			left: this.body.boundingBox.left - 1,
			right: this.body.boundingBox.left,
		};

		const inFrontOfWall = !this.tilemapService.query(this.body.boundingBox, this.position.x + (this.direction === "right" ? 1 : -1), this.position.y);
		const inFrontOfHole = this.tilemapService.query(this.direction === "right" ? rightFeetSensor : leftFeetSensor, this.position.x + this.velocity.x + 1, this.position.y);
		if (inFrontOfWall || inFrontOfHole) {
			this.direction = this.direction === "left" ? "right" : "left";
		}

		if (this.direction === "right") {
			this.velocity.x = this.speed;
		} else {
			this.velocity.x = -this.speed;
		}

		this.spriteRenderer.isFlipped = this.direction === "left";
	}

	private async onCollision(payload: { x: number; y: number }): Promise<void> {
		if (!this.active) {
			return;
		}

		if (payload.y !== 0) {
			this.velocity.y = 0;
		}
	}
}
