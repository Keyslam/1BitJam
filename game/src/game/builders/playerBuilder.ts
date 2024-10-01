import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { createAnimation } from "../rendering/animation";
import { SpriteRenderer } from "../rendering/spriteRenderer";

export interface PlayerProps {
	x: number;
	y: number;
}

export class PlayerBuilder extends Builder<PlayerProps> {
	private animations = createAnimation("player");

	public build(props: PlayerProps): Entity {
		return new Entity( //
			new Position(props.x, props.y),
			new SpriteRenderer(),
			new AnimatedSprite(this.animations, "Idle"),
		);
	}
}
