import { Builder } from "./builder";
import { Entity } from "./entity";
import { Service } from "./service";

export class Scene {
	private entities: Entity[] = [];

	private serviceLookup: Record<string, Service> = {};
	private services: Service[] = [];

	constructor(...services: Service[]) {
		for (const service of services) {
			service["_scene"] = this;

			this.serviceLookup[service.constructor.name] = service;
			this.services.push(service);
		}

		for (const service of this.services) {
			service.onFinalize();
		}
	}

	public addEntity<TProps>(builder: Builder<TProps>, props: TProps): Entity {
		const entity = builder.build(props);
		entity.finalize(this);

		this.entities.push(entity);

		return entity;
	}

	public onFixedUpdate(): void {
		for (const service of this.services) {
			service.preFixedUpdate();
		}

		for (const entity of this.entities) {
			entity.onFixedUpdate();
		}

		for (const service of this.services) {
			service.postFixedUpdate();
		}
	}

	public onUpdate(dt: number): void {
		for (const service of this.services) {
			service.preUpdate(dt);
		}

		for (const entity of this.entities) {
			entity.onUpdate(dt);
		}

		for (const service of this.services) {
			service.postUpdate(dt);
		}
	}

	public onRender(interpolation: number): void {
		for (const service of this.services) {
			service.preRender(interpolation);
		}

		for (const entity of this.entities) {
			entity.onRender(interpolation);
		}

		for (const service of this.services) {
			service.postRender(interpolation);
		}
	}

	public onGui(interpolation: number): void {
		for (const service of this.services) {
			service.preGui(interpolation);
		}

		for (const entity of this.entities) {
			entity.onGui(interpolation);
		}

		for (const service of this.services) {
			service.postGui(interpolation);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public getService<T extends Service>(serviceClass: new (...args: any[]) => T): T {
		const service = this.serviceLookup[serviceClass.name] as T | undefined;

		if (service === undefined) {
			throw new Error(`Can't get service '${serviceClass.name}'. Does not exist on Scene`);
		}

		return service;
	}
}
