import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { AudioService } from "../audio/audioService";
import { Position } from "../common/position";
import { Body } from "../physics/body";
import { Velocity } from "../physics/velocity";
import { PlayerControls } from "./playerControls";

export class SpikebugBehaviour extends Component {
	private player!: Entity;
	private audioService!: AudioService;

	private position!: Position;
	private body!: Body;

	public override onFinalize(): void {
		this.audioService = this.injectService(AudioService);
		this.position = this.inject(Position);
		this.body = this.inject(Body);
	}

	public override onStart(): void {
		this.player = this.scene.findChildByComponent(PlayerControls);
	}

	public override async onFixedUpdate(): Promise<void> {
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
			const playerVelocity = this.player.getComponent(Velocity);
			playerVelocity.y = -3;
			if (cx > px) {
				playerVelocity.x = -3;
				
			} else {
				playerVelocity.x = 3;
			}
			this.audioService.playSound("bump");
		}
	}
}
