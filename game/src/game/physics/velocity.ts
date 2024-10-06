import { Component } from "../../core/component";
import { Position } from "../common/position";
import { Body } from "./body";

export class Velocity extends Component {
	private target!: Position | Body;

	public x: number;
	public y: number;

	constructor(x: number = 0, y: number = 0) {
		super();

		this.x = x;
		this.y = y;
	}

	public override onFinalize(): void {
		const target = this.tryInject(Body) || this.tryInject(Position);

		if (target === undefined) {
			throw new Error("Entity doesn't have Position nor Body");
		}

		this.target = target;
	}

	public override onFixedUpdate(): void {
		if (this.target instanceof Position) {
			this.target.x += this.x;
			this.target.y += this.y;
		} else if (this.target instanceof Body) {
			this.target.moveX(this.x);
			this.target.moveY(this.y);
		}
	}
}
