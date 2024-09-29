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

	public onFinalize(): void {}
	public onFixedUpdate(): void {}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public onUpdate(dt: number): void {}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public onRender(interpolation: number): void {}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public onGui(interpolation: number): void {}
	public onDestroy(): void {}

	protected destroy(): void {}
}
