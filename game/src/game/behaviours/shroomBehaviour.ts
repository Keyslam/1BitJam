import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { AudioService } from "../audio/audioService";
import { Position } from "../common/position";
import { Body } from "../physics/body";
import { Velocity } from "../physics/velocity";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { ScheduleService } from "../scheduling/scheduleService";
import { Patrol } from "./patrol";
import { PlayerControls } from "./playerControls";

export class ShroomBehaviour extends Component {
	private player!: Entity;

	private scheduleService!: ScheduleService;
	private audioService!: AudioService;

	private position!: Position;
	private body!: Body;
	private patrol!: Patrol;
	private animatedSprite!: AnimatedSprite;

	private dying = false;

	public override onFinalize(): void {
		this.scheduleService = this.injectService(ScheduleService);
		this.audioService = this.injectService(AudioService);

		this.position = this.inject(Position);
		this.body = this.inject(Body);
		this.patrol = this.inject(Patrol);
		this.animatedSprite = this.inject(AnimatedSprite);
	}

	public override onStart(): void {
		this.player = this.scene.findChildByComponent(PlayerControls);
	}

	public override async onFixedUpdate(): Promise<void> {
		if (this.dying) {
			return;
		}

		const playerPosition = this.player.getComponent(Position);
		const playerBody = this.player.getComponent(Body);

		const cx = this.position.x + (this.body.boundingBox.right - playerBody.boundingBox.left) / 2;
		const cy = this.position.y + (this.body.boundingBox.bottom - this.body.boundingBox.top) / 2;

		const px = playerPosition.x + (playerBody.boundingBox.right - playerBody.boundingBox.left) / 2;
		const py = playerPosition.y + (playerBody.boundingBox.bottom - playerBody.boundingBox.top) / 2;

		const dx = Math.abs(cx - px);
		const dy = Math.abs(cy - py);

		const distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < 20) {
			if (dx > dy) {
				const playerVelocity = this.player.getComponent(Velocity);
				playerVelocity.y = -3;
				if (cx > px) {
					playerVelocity.x = -3;

				} else {
					playerVelocity.x = 3;
				}

				this.audioService.playSound("bump");

			} else {
				this.patrol.active = false;
				this.animatedSprite.play("Squash");
				this.audioService.playSound("shroom-stomp");
				this.dying = true;

				const playerVelocity = this.player.getComponent(Velocity);
				playerVelocity.y = -5;

				await this.scheduleService.waitForSeconds(8 * 0.12);

				this.destroy();
			}
		}

	}
}
