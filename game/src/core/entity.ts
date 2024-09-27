import { Component } from "./component";
import { Scene } from "./scene";

export class Entity {
	private _scene!: Scene;

	private updateableComponents: Component[] = [];
	private drawableComponents: Component[] = [];

	private componentLookup: Record<string, Component> = {};

	private isFinalized = false;

	public get scene(): Scene {
		return this._scene;
	}

	public addComponent(component: Component): Entity {
		if (this.isFinalized) {
			throw new Error("Can't add component. Entity is already finalized.");
		}

		this.componentLookup[component.constructor.name] = component;

		if (component.update !== Component.prototype.update) {
			this.updateableComponents.push(component);
		}

		if (component.draw !== Component.prototype.draw) {
			this.drawableComponents.push(component);
		}

		return this;
	}

	public addComponents(...components: Component[]): Entity {
		for (const component of components) {
			this.addComponent(component);
		}

		return this;
	}

	public getComponent<T extends Component>(componentClass: new (...args: unknown[]) => T): T {
		const component = this.componentLookup[componentClass.name] as T | undefined;

		if (component === undefined) {
			throw new Error(`Can't get component '${componentClass.name}'. Does not exist on Entity`);
		}

		return component;
	}

	public update(dt: number): void {
		if (!this.isFinalized) {
			throw new Error("Can't update entity. Entity isn't finalized");
		}

		for (const component of this.updateableComponents) {
			component.update(dt);
		}
	}

	public draw(): void {
		if (!this.isFinalized) {
			throw new Error("Can't draw entity. Entity isn't finalized");
		}

		for (const component of this.drawableComponents) {
			component.draw();
		}
	}

	public finalize(): { isUpdateable: boolean; isDrawable: boolean } {
		this.isFinalized = true;

		return {
			isUpdateable: this.updateableComponents.length > 0,
			isDrawable: this.drawableComponents.length > 0,
		};
	}
}
