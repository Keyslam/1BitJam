import { Component } from "../../core/component";
import { Position } from "../common/position";
import { TilemapService } from "../levels/tilemapService";
import { Body } from "../physics/body";
import { BoundingBox } from "../physics/boundingBox";
import { Mass } from "../physics/mass";
import { Velocity } from "../physics/velocity";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { Colors } from "../rendering/color";
import { RenderService } from "../rendering/renderService";
import { SpriteRenderer } from "../rendering/spriteRenderer";

export class PlayerControls extends Component {
	
	private static friction = 0.5;
	private static acceleration = 1;
	private static maxHorizontalSpeed = 2;
	private static maxChargeTime = 0.6 * 60;

	private static horizontalJumpForce = 2.5;
	private static verticalJumpForce = 8;

	private renderService!: RenderService;
	private tilemapService!: TilemapService;

	private position!: Position;
	private velocity!: Velocity;
	private spriteRenderer!: SpriteRenderer;
	private animatedSprite!: AnimatedSprite;
	private mass!: Mass;
	private body!: Body;

	private isCharging = false;
	private chargeTime = 0;

	public override onFinalize(): void {
		this.renderService = this.injectService(RenderService);
		this.tilemapService = this.injectService(TilemapService);

		this.position = this.inject(Position);
		this.velocity = this.inject(Velocity);
		this.spriteRenderer = this.inject(SpriteRenderer);
		this.animatedSprite = this.inject(AnimatedSprite);
		this.mass = this.inject(Mass);
		this.body = this.inject(Body);
	}

	public override onFixedUpdate(): void {
		const feetSensor: BoundingBox = {
			top: this.body.boundingBox.bottom,
			bottom: this.body.boundingBox.bottom + 1,
			left: this.body.boundingBox.left,
			right: this.body.boundingBox.right,
		};

		const isOnGround = !this.tilemapService.query(feetSensor, this.position.x, this.position.y);

		if (!this.isCharging) {
			const horizontalAxis = this.getHorizontalAxis();

			if (horizontalAxis < 0 && isOnGround) {
				this.velocity.x = Math.max(-PlayerControls.maxHorizontalSpeed, this.velocity.x - PlayerControls.acceleration);
				this.spriteRenderer.isFlipped = true;
			}

			if (horizontalAxis > 0 && isOnGround) {
				this.velocity.x = Math.min(PlayerControls.maxHorizontalSpeed, this.velocity.x + PlayerControls.acceleration);
				this.spriteRenderer.isFlipped = false;
			}

			if (horizontalAxis === 0 && isOnGround) {
				if (this.velocity.x > 0) {
					this.velocity.x = Math.max(0, this.velocity.x - PlayerControls.friction);
				}

				if (this.velocity.x < 0) {
					this.velocity.x = Math.min(0, this.velocity.x + PlayerControls.friction);
				}
			}
		}

		if (isOnGround) {
			if (this.isCharging) {
				if (love.keyboard.isDown("z")) {
					// Continue charging
					this.chargeTime = Math.min(PlayerControls.maxChargeTime, this.chargeTime + 1);
				} else {
					this.velocity.x = PlayerControls.horizontalJumpForce * (this.spriteRenderer.isFlipped ? -1 : 1);

					const verticalRatio = this.chargeTime / PlayerControls.maxChargeTime;
					this.velocity.y = -PlayerControls.verticalJumpForce * verticalRatio;

					this.chargeTime = 0;
					this.isCharging = false;
					
				}
			} else {
				if (love.keyboard.isDown("z")) {
					// Start charging
					this.chargeTime = 0;
					this.isCharging = true;

					this.velocity.x = 0;
				}
			}
		}

		// Animations
		if (this.isCharging) {
			this.animatedSprite.play("Charge");
		} else {
			if (isOnGround) {
				const horizontalAxis = this.getHorizontalAxis();

				if (horizontalAxis !== 0) {
					this.animatedSprite.play("Run");
				} else {
					this.animatedSprite.play("Idle");
				}
			} else {
				if (this.velocity.y < 0) {
					this.animatedSprite.play("Jump");
				} else {
					this.animatedSprite.play("Fall");
				}
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override onRender(interpolation: number): void {
		if (this.isCharging) {
			
			this.renderService.drawRectangle(this.position.x - 8, this.position.y + 14, 16, 4, "foreground", Colors.black, "fill");

			const ratio = this.chargeTime / PlayerControls.maxChargeTime;
			this.renderService.drawRectangle(this.position.x - 7, this.position.y + 15, 14 * ratio, 1, "foreground", Colors.white, "line");
		}
	}

	private getHorizontalAxis(): number {
		return (love.keyboard.isDown("left") ? -1 : 0) + (love.keyboard.isDown("right") ? 1 : 0);
	}
}
