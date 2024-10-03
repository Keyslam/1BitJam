import { Entity } from "../../core/entity";
import { Service } from "../../core/service";
import { Position } from "../common/position";

function lerp(a: number, b: number, alpha: number): number {
	return a + alpha * (b - a);
}

export class CameraService extends Service {
	private static speed = 10;

	private target: Entity | undefined;

	public x: number = 0;
	public y: number = 0;

	public startFollowing(entity: Entity, snapTo: boolean): void {
		this.target = entity;

		if (snapTo) {
			const targetPosition = this.target.getComponent(Position);
			this.x = targetPosition.x;
			this.y = targetPosition.y;
		}
	}

	public override postUpdate(dt: number): void {
		const targetPosition = this.target?.tryGetComponent(Position);
		if (targetPosition === undefined) {
			return;
		}

		this.x = lerp(this.x, targetPosition.x, CameraService.speed * dt);
		this.y = lerp(this.y, targetPosition.y, CameraService.speed * dt);
	}
}
