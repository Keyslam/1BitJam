import { Component } from "../../core/component";
import { Animation } from "./animation";
import { SpriteRenderer } from "./spriteRenderer";

export class AnimatedSprite extends Component {
	private spriteRenderer!: SpriteRenderer;

	private animations: Record<string, Animation>;
	public activeAnimationName: string;

	private currentDuration: number;
	private currentFrameIndex: number;

	private _didFinish: boolean;
	/* prettier-ignore */ public get didFinish() { return this._didFinish; }
	/* prettier-ignore */ private set didFinish(didFinish: boolean) { this._didFinish = didFinish; }

	constructor(animations: Record<string, Animation>, initalAnimationName: string) {
		super();

		this.animations = animations;
		this.activeAnimationName = initalAnimationName;

		this.currentDuration = 0;
		this.currentFrameIndex = 0;

		this._didFinish = false;
	}

	public override onFinalize(): void {
		this.spriteRenderer = this.entity.getComponent(SpriteRenderer);
	}

	public override onUpdate(dt: number): void {
		this.didFinish = false;
		this.currentDuration += dt;

		while (this.currentDuration >= this.activeFrame.duration) {
			this.currentDuration -= this.activeFrame.duration;
			this.currentFrameIndex++;

			if (this.currentFrameIndex >= this.activeAnimation.frames.length) {
				this.didFinish = true;

				if (this.activeAnimation.playback === "freeze") {
					this.currentFrameIndex -= 1;
				}

				if (this.activeAnimation.playback === "loop") {
					this.currentFrameIndex = 0;
				}
			}
		}

		this.spriteRenderer.sprite = this.activeFrame.sprite;
	}

	public play(animationName: string) {
		if (animationName === this.activeAnimationName) {
			return;
		}

		this.activeAnimationName = animationName;

		this.currentDuration = 0;
		this.currentFrameIndex = 0;

		this.spriteRenderer.sprite = this.activeFrame.sprite;
	}

	private get activeAnimation() {
		return this.animations[this.activeAnimationName];
	}

	private get activeFrame() {
		return this.activeAnimation.frames[this.currentFrameIndex];
	}
}
