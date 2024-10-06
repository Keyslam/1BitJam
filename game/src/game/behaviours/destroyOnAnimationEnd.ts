import { Component } from "../../core/component";
import { AnimatedSprite } from "../rendering/animatedSprite";

export class DestroyOnAnimationEnd extends Component {
	private animatedSprite!: AnimatedSprite;

	public override onFinalize(): void {
		this.animatedSprite = this.inject(AnimatedSprite);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override onUpdate(dt: number): void {
		if (this.animatedSprite.didFinish) {
			this.destroy();
		}
	}
}
