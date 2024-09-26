import { Entity } from "./entity";
import { Scene } from "./scene";

export abstract class Component {
	private _entity!: Entity;

	public get entity(): Entity {
		return this._entity;
	}

	public get scene(): Scene {
		return this.entity.scene;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public update(dt: number): void {}
	public draw(): void {}

	protected destroy(): void {}
}
