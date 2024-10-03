import { Scene } from "./scene";

/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class Service {
	private _scene!: Scene;

	public get scene(): Scene {
		return this._scene;
	}

	public onFinalize(): void {}

	public preFixedUpdate(): void {}
	public postFixedUpdate(): void {}

	public preUpdate(dt: number): void {}
	public postUpdate(dt: number): void {}

	public preRender(interpolation: number): void {}
	public postRender(interpolation: number): void {}

	public preGui(interpolation: number): void {}
	public postGui(interpolation: number): void {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected inject<T extends Service>(serviceClass: new (...args: any[]) => T): T {
		return this.scene.getService(serviceClass);
	}
}
