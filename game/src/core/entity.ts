import { Component } from "./component";
import { Scene } from "./scene";

export class Entity {
	private _scene!: Scene;
	private isFinalized = false;

	private components: Component[] = [];

	private onFixedUpdateComponents: Component[] = [];
	private onUpdateComponents: Component[] = [];
	private onRenderComponents: Component[] = [];
	private onGuiComponents: Component[] = [];

	private componentLookup: Record<string, Component> = {};

	public get scene(): Scene {
		return this._scene;
	}

	constructor(...components: Component[]) {
		for (const component of components) {
			this.addComponent(component);
		}
	}

	public addComponent(component: Component): Entity {
		const lookupKey = component.constructor.name;

		if (this.componentLookup[lookupKey] !== undefined) {
			throw new Error(`Can't add component '${lookupKey}'. A component of the same type was already added to the Entity.`);
		}

		this.components.push(component);

		if (component.onFixedUpdate !== Component.prototype.onFixedUpdate) {
			this.onFixedUpdateComponents.push(component);
		}

		if (component.onUpdate !== Component.prototype.onUpdate) {
			this.onUpdateComponents.push(component);
		}

		if (component.onRender !== Component.prototype.onRender) {
			this.onRenderComponents.push(component);
		}

		if (component.onGui !== Component.prototype.onGui) {
			this.onGuiComponents.push(component);
		}

		this.componentLookup[lookupKey] = component;

		return this;
	}

	public addComponents(...components: Component[]): Entity {
		for (const component of components) {
			this.addComponent(component);
		}

		return this;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public getComponent<T extends Component>(componentClass: new (...args: any[]) => T): T {
		const component = this.componentLookup[componentClass.name] as T | undefined;

		if (component === undefined) {
			throw new Error(`Can't get component '${componentClass.name}'. Does not exist on Entity`);
		}

		return component;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public tryGetComponent<T extends Component>(componentClass: new (...args: any[]) => T): T | undefined {
		return this.componentLookup[componentClass.name] as T | undefined;
	}

	public onFixedUpdate(): void {
		for (const component of this.onFixedUpdateComponents) {
			component.onFixedUpdate();
		}
	}

	public onUpdate(dt: number): void {
		for (const component of this.onUpdateComponents) {
			component.onUpdate(dt);
		}
	}

	public onRender(interpolation: number): void {
		for (const component of this.onRenderComponents) {
			component.onRender(interpolation);
		}
	}

	public onGui(interpolation: number): void {
		for (const component of this.onGuiComponents) {
			component.onGui(interpolation);
		}
	}

	public finalize(scene: Scene): {
		hasOnFixedUpdate: boolean;
		hasOnUpdate: boolean;
		hasOnRender: boolean;
		hasOnGui: boolean;
	} {
		if (this.isFinalized) {
			throw new Error("Can't finalize Entity. Entity was already finalized.");
		}

		this.isFinalized = true;
		this._scene = scene;

		for (const component of this.components) {
			component["_entity"] = this;
		}

		for (const component of this.components) {
			component.onFinalize();
		}

		return {
			hasOnFixedUpdate: this.onFixedUpdateComponents.length > 0,
			hasOnUpdate: this.onUpdateComponents.length > 0,
			hasOnRender: this.onRenderComponents.length > 0,
			hasOnGui: this.onGuiComponents.length > 0,
		};
	}

	public destroy(): void {
		this.scene.destroy(this);
	}
}
