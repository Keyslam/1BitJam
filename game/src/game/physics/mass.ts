import { Component } from "../../core/component";
import { Velocity } from "./velocity";

export class Mass extends Component {
	private static gravity = 0.4;

	private velocity!: Velocity;

	public gravityMultiplier: number;

	constructor(gravityMultiplier: number = 1) {
		super();

		this.gravityMultiplier = gravityMultiplier;
	}

	public onFinalize(): void {
		this.velocity = this.inject(Velocity);
	}

	public override onFixedUpdate(): void {
		this.velocity.y += Mass.gravity * this.gravityMultiplier;
	}
}
