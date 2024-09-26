import { Component } from "./component";
import { Scene } from "./scene";

export class Entity {
	private _scene!: Scene;

	private updateableComponents: Component[] = [];
	private drawableComponents: Component[] = [];

	private isFinalized = false;

	public get scene(): Scene {
		return this._scene;
	}

	public addComponent(component: Component): Entity {
		if (this.isFinalized) {
			throw new Error("Can't add component. Entity is already finalized.");
		}

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

	public update(dt: number): void {
		for (const component of this.updateableComponents) {
			component.update(dt);
		}
	}

	public draw(): void {
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
