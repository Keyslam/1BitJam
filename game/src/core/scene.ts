import { Builder } from "./builder";
import { Entity } from "./entity";

export class Scene {
	private entities: Entity[] = [];

	public addEntity<TProps>(builder: Builder<TProps>, props: TProps): Entity {
		const entity = builder.build(props);
		entity.finalize(this);

		this.entities.push(entity);

		return entity;
	}

	public onFixedUpdate(): void {
		for (const entity of this.entities) {
			entity.onFixedUpdate();
		}
	}

	public onUpdate(dt: number): void {
		for (const entity of this.entities) {
			entity.onUpdate(dt);
		}
	}

	public onRender(interpolation: number): void {
		for (const entity of this.entities) {
			entity.onRender(interpolation);
		}
	}

	public onGui(interpolation: number): void {
		for (const entity of this.entities) {
			entity.onGui(interpolation);
		}
	}
}
