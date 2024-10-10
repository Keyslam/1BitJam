import { Component } from "../../core/component";
import { AudioService } from "../audio/audioService";
import { DustBuilder } from "../builders/dustBuilder";
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
import { ScheduleService } from "../scheduling/scheduleService";

export class PlayerControls extends Component {
	private static friction = 0.5;
	private static acceleration = 1;
	private static maxHorizontalSpeed = 2;
	private static maxChargeTime = 0.6 * 60;

	private static horizontalJumpForce = 2.5;
	private static verticalJumpForce = 8;

	private renderService!: RenderService;
	private tilemapService!: TilemapService;
	private scheduleService!: ScheduleService;
	private audioService!: AudioService;

	private position!: Position;
	private velocity!: Velocity;
	private spriteRenderer!: SpriteRenderer;
	private animatedSprite!: AnimatedSprite;
	private mass!: Mass;
	private body!: Body;

	private isCharging = false;
	private chargeTime = 0;

	private didBounce = false;
	private isSplat = false;
	private isGettingUp = false;
	private isSquish = false;

	public goNext = false;

	public override onFinalize(): void {
		this.renderService = this.injectService(RenderService);
		this.tilemapService = this.injectService(TilemapService);
		this.scheduleService = this.injectService(ScheduleService);
		this.audioService = this.injectService(AudioService);

		this.position = this.inject(Position);
		this.velocity = this.inject(Velocity);
		this.spriteRenderer = this.inject(SpriteRenderer);
		this.animatedSprite = this.inject(AnimatedSprite);
		this.mass = this.inject(Mass);
		this.body = this.inject(Body);

		this.body.onCollision.subscribe((payload) => this.onCollision(payload));
	}

	public override onFixedUpdate(): void {
		const feetSensor: BoundingBox = {
			top: this.body.boundingBox.bottom,
			bottom: this.body.boundingBox.bottom + 1,
			left: this.body.boundingBox.left,
			right: this.body.boundingBox.right,
		};

		const isOnGround = !this.tilemapService.query(feetSensor, this.position.x, this.position.y);
		const slope = this.tilemapService.isOnSlope(feetSensor, this.position.x, this.position.y);

		if (slope !== false) {
			if (this.velocity.y > 0) {
				
				if (slope === "slope-right") {
					this.spriteRenderer.isFlipped = true;
				} else {
					this.spriteRenderer.isFlipped = false;
					
				}
				this.animatedSprite.play("Slide");
			}
		} else {
			
			if (isOnGround) {
				this.didBounce = false;
			}

			if (!this.isCharging && !this.isSplat && !this.isGettingUp) {
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

			if (isOnGround && !this.isSplat && !this.isGettingUp) {
				if (this.isCharging) {
					if (love.keyboard.isDown("z")) {
						// Continue charging
						this.chargeTime = Math.min(PlayerControls.maxChargeTime, this.chargeTime + 1);
					} else {
						this.velocity.x = PlayerControls.horizontalJumpForce * (this.spriteRenderer.isFlipped ? -1 : 1);

						const ratio = this.chargeTime / PlayerControls.maxChargeTime;
						this.velocity.y = -PlayerControls.verticalJumpForce * ratio;

						if (ratio > 0.5) {
							this.audioService.playSound("jump-long");
						} else {
							this.audioService.playSound("jump-short");
						}

						this.scene.addEntity(new DustBuilder(), {
							x: this.position.x,
							y: this.position.y,
							kind: "horizontal",
							flipped: false,
						});

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
					if (this.isSplat) {
						this.animatedSprite.play("Splat");
					} else if (this.isGettingUp) {
						this.animatedSprite.play("GetUp");
						
					} else {
						const horizontalAxis = this.getHorizontalAxis();

						if (horizontalAxis !== 0) {
							this.animatedSprite.play("Run");
						} else {
							this.animatedSprite.play("Idle");
						}
					}
				} else {
					if (this.isSquish) {
						this.animatedSprite.play("JumpSquash");
					} else {
						if (this.velocity.y < 0) {
							this.animatedSprite.play("Jump");
						} else {
							if (this.didBounce) {
								this.animatedSprite.play("Vault");
							} else {
								this.animatedSprite.play("Fall");
							}
						}
					}
				}
			}
		}

		if (this.position.y <= 0) {
			this.goNext = true;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override onRender(interpolation: number): void {
		if (this.isCharging) {
			this.renderService.drawRectangle(this.position.x - 8, this.position.y + 14, 16, 4, "foreground", Colors.dark, "fill");

			const ratio = this.chargeTime / PlayerControls.maxChargeTime;
			this.renderService.drawRectangle(this.position.x - 7, this.position.y + 15, 14 * ratio, 1, "foreground", Colors.white, "line");
		}
	}

	private async onCollision(payload: { x: number; y: number }): Promise<void> {
		if (payload.y < 0) {
			this.velocity.y = 0;
			this.isSquish = true;
			await this.scheduleService.waitForSeconds(0.3);
			this.isSquish = false;
		}

		if (payload.y > 0) {
			if (this.velocity.y >= 10) {
				this.audioService.playSound("splat");
				this.velocity.x = 0;
				this.velocity.y = 0;
				this.isSplat = true;
				await this.scheduleService.waitForSeconds(0.8);
				this.isSplat = false;
				this.isGettingUp = true;
				await this.scheduleService.waitForSeconds(0.2);
				this.isGettingUp = false;
			}

			this.velocity.y = 0;
		}

		if (payload.x !== 0) {
			const feetSensor: BoundingBox = {
				top: this.body.boundingBox.bottom,
				bottom: this.body.boundingBox.bottom + 1,
				left: this.body.boundingBox.left,
				right: this.body.boundingBox.right,
			};
			const isOnGround = !this.tilemapService.query(feetSensor, this.position.x, this.position.y);

			if (isOnGround) {
				this.velocity.x = 0;
			} else {
				{
					const x = this.position.x + (this.spriteRenderer.isFlipped ? 4 : -5);
					const y = this.position.y;

					this.scene.addEntity(new DustBuilder(), {
						x: x,
						y: y,
						kind: "vertical",
						flipped: !this.spriteRenderer.isFlipped,
					});
				}

				this.audioService.playSound("bounce");
				this.velocity.x *= -0.8;
				this.didBounce = true;
				this.spriteRenderer.isFlipped = !this.spriteRenderer.isFlipped;
			}
		}
	}

	private getHorizontalAxis(): number {
		return (love.keyboard.isDown("left") ? -1 : 0) + (love.keyboard.isDown("right") ? 1 : 0);
	}
}