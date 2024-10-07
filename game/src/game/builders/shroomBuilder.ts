import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Patrol } from "../behaviours/patrol";
import { ShroomBehaviour } from "../behaviours/shroomBehaviour";
import { Position } from "../common/position";
import { Body } from "../physics/body";
import { Mass } from "../physics/mass";
import { Velocity } from "../physics/velocity";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { createAnimation } from "../rendering/animation";
import { SpriteRenderer } from "../rendering/spriteRenderer";

export interface ShroomProps {
	x: number;
	y: number;
}

export class ShroomBuilder extends Builder<ShroomProps> {
	private animations = createAnimation("shroom");

	public build(props: ShroomProps): Entity {
		return new Entity( //
			new Position(props.x, props.y),
			new SpriteRenderer(),
			new AnimatedSprite(this.animations, "Walk"),
			new Velocity(),
			new Mass(),
			new Body({
				top: -13,
				bottom: 9,
				left: -12,
				right: 12,
			}),
			new Patrol(0.3),
			new ShroomBehaviour(),
		)
	}
}
