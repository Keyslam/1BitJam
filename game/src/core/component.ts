import { Entity } from "./entity";
import { Scene } from "./scene";
import { Service } from "./service";

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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected inject<T extends Component>(componentClass: new (...args: any[]) => T): T {
		return this.entity.getComponent(componentClass);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected tryInject<T extends Component>(componentClass: new (...args: any[]) => T): T | undefined {
		return this.entity.tryGetComponent(componentClass);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected injectService<T extends Service>(serviceClass: new (...args: any[]) => T): T {
		return this.entity.scene.getService(serviceClass);
	}

	protected destroy(): void {
		this.entity.destroy();
	}
}
