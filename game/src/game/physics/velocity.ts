import { Component } from "../../core/component";
import { Position } from "../common/position";

export class Velocity extends Component {
	private position!: Position;

	public x: number;
	public y: number;

	constructor(x: number = 0, y: number = 0) {
		super();

		this.x = x;
		this.y = y;
	}

	public override onFinalize(): void {
		this.position = this.inject(Position);
	}

	public override onFixedUpdate(): void {
		this.position.x += this.x;
		this.position.y += this.y;
	}
}
