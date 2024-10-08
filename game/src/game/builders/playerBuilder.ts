import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { PlayerControls } from "../behaviours/playerControls";
import { Body } from "../physics/body";
import { Mass } from "../physics/mass";
import { Velocity } from "../physics/velocity";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { createAnimation } from "../rendering/animation";
import { SpriteRenderer } from "../rendering/spriteRenderer";

export interface PlayerProps {
	x: number;
	y: number;
	hop: boolean;
}

export class PlayerBuilder extends Builder<PlayerProps> {
	private animations = createAnimation("player");

	public build(props: PlayerProps): Entity {
		return new Entity( //
			new Position(props.x, props.y),
			new SpriteRenderer(),
			new AnimatedSprite(this.animations, "Idle"),
			new Velocity(0, 0),
			new Mass(),
			new Body({
				top: -3,
				bottom: 12,
				left: -8,
				right: 7,
			}),
			new PlayerControls(props.hop),
		);
	}
}
