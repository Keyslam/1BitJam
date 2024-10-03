import { Component } from "../../core/component";
import { Position } from "../common/position";
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
	private static maxJumpForce = 10;

	private renderService!: RenderService;

	private position!: Position;
	private velocity!: Velocity;
	private spriteRenderer!: SpriteRenderer;
	private animatedSprite!: AnimatedSprite;
	private mass!: Mass;

	private isCharging = false;
	private chargeTime = 0;

	public override onFinalize(): void {
		this.renderService = this.injectService(RenderService);

		this.position = this.inject(Position);
		this.velocity = this.inject(Velocity);
		this.spriteRenderer = this.inject(SpriteRenderer);
		this.animatedSprite = this.inject(AnimatedSprite);
		this.mass = this.inject(Mass);
	}

	public override onFixedUpdate(): void {
		if (this.position.y >= 160) {
			this.position.y = 160;
			this.velocity.y = 0;
		}

		if (!this.isCharging) {
			const horizontalAxis = this.getHorizontalAxis();

			if (horizontalAxis < 0) {
				this.velocity.x = Math.max(-PlayerControls.maxHorizontalSpeed, this.velocity.x - PlayerControls.acceleration);
				this.spriteRenderer.isFlipped = true;
			}

			if (horizontalAxis > 0) {
				this.velocity.x = Math.min(PlayerControls.maxHorizontalSpeed, this.velocity.x + PlayerControls.acceleration);
				this.spriteRenderer.isFlipped = false;
			}

			if (horizontalAxis === 0) {
				if (this.velocity.x > 0) {
					this.velocity.x = Math.max(0, this.velocity.x - PlayerControls.friction);
				}

				if (this.velocity.x < 0) {
					this.velocity.x = Math.min(0, this.velocity.x + PlayerControls.friction);
				}
			}
		}

		if (this.position.y === 160) {
			if (this.isCharging) {
				if (love.keyboard.isDown("z")) {
					// Continue charging
					this.chargeTime = Math.min(PlayerControls.maxChargeTime, this.chargeTime + 1);
				} else {
					const ratio = this.chargeTime / PlayerControls.maxChargeTime;

					this.chargeTime = 0;
					this.isCharging = false;

					this.velocity.y -= PlayerControls.maxJumpForce * ratio;
				}
			} else {
				if (love.keyboard.isDown("z")) {
					// Start charing
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
			if (this.position.y === 160) {
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
			
			this.renderService.drawRectangle(this.position.x - 8, this.position.y + 14, 16, 3, "foreground", Colors.white, "line");

			const ratio = this.chargeTime / PlayerControls.maxChargeTime;
			this.renderService.drawRectangle(this.position.x - 8, this.position.y + 15, 16 * ratio, 1, "foreground", Colors.white, "line");
		}
	}

	private getHorizontalAxis(): number {
		return (love.keyboard.isDown("left") ? -1 : 0) + (love.keyboard.isDown("right") ? 1 : 0);
	}
}
