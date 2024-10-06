import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { DestroyOnAnimationEnd } from "../behaviours/destroyOnAnimationEnd";
import { Position } from "../common/position";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { createAnimation } from "../rendering/animation";
import { SpriteRenderer } from "../rendering/spriteRenderer";

export interface DustProps {
	x: number;
	y: number;
	kind: "vertical" | "horizontal";
	flipped: boolean;
}

export class DustBuilder extends Builder<DustProps> {
	private animation = createAnimation("dust");

	public build(props: DustProps): Entity {
		return new Entity( //
			new Position(props.x, props.y),
			new SpriteRenderer(undefined, props.flipped),
			new AnimatedSprite(this.animation, props.kind === "vertical" ? "Wall" : "Floor"),
			new DestroyOnAnimationEnd()
		);
	}
}
