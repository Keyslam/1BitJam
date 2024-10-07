import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { SpriteRenderer } from "../rendering/spriteRenderer";

export class SplashScreenBuilder extends Builder<undefined> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public build(props: undefined): Entity {
		return new Entity(
			new Position(0, 0),
			new SpriteRenderer({
				image: "splash.png",
				viewport: undefined,
			}),
		);
	}
	
}
