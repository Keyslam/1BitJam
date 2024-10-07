import { Entity } from "../../core/entity";
import { Service } from "../../core/service";
import { Position } from "../common/position";

function lerp(a: number, b: number, alpha: number): number {
	return a + alpha * (b - a);
}

export class CameraService extends Service {
	private static speed = 0.2;

	private target: Entity | undefined;

	public x: number = 0;
	public y: number = 0;

	private boundsW: number = 0;
	private boundsH: number = 0;

	public startFollowing(entity: Entity, snapTo: boolean): void {
		this.target = entity;

		if (snapTo) {
			const targetPosition = this.target.getComponent(Position);
			this.x = targetPosition.x;
			this.y = targetPosition.y;
		}
	}

	public setBounds(w: number, h: number): void {
		this.boundsW = w;
		this.boundsH = h;
	}

	public override postFixedUpdate(): void {
		const targetPosition = this.target?.tryGetComponent(Position);
		if (targetPosition === undefined) {
			return;
		}

		this.x = lerp(this.x, targetPosition.x, CameraService.speed);
		this.y = lerp(this.y, targetPosition.y, CameraService.speed);

		if (this.x < 320 / 2) this.x = 320 / 2;
		if (this.y < 180 / 2) this.y = 180 / 2;

		if (this.x > this.boundsW - 320 / 2) this.x = this.boundsW - 320 / 2;
		if (this.y > this.boundsH - 180 / 2) this.y = this.boundsH - 180 / 2;
	}
}
