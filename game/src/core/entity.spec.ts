import { describe, expect, it } from "../libraries/lester/lester";
import { Component } from "./component";
import { Entity } from "./entity";

class TestComponent extends Component {}

class UpdateableComponent extends Component {
	private hook: () => void;

	constructor(hook: () => void = () => {}) {
		super();
		this.hook = hook;
	}

	public override onUpdate() {
		this.hook();
	}
}

class RenderableComponent extends Component {
	private hook: () => void;

	constructor(hook: () => void = () => {}) {
		super();
		this.hook = hook;
	}

	public override onRender() {
		this.hook();
	}
}

describe("entity", () => {
	it("should be able get component after adding it", () => {
		const entity = new Entity();
		entity.addComponent(new TestComponent());

		const component = entity.getComponent(TestComponent);

		expect.exist(component);
	});

	it("should throw error when getting component that was not added", () => {
		const entity = new Entity();

		expect.fail(() => {
			entity.getComponent(TestComponent);
		});
	});

	it("should be able to try get component after adding it", () => {
		const entity = new Entity();
		entity.addComponent(new TestComponent());

		const component = entity.tryGetComponent(TestComponent);

		expect.exist(component);
	});

	it("should return undefined when trying to get a component that was not added", () => {
		const entity = new Entity();

		const component = entity.tryGetComponent(TestComponent);

		expect.not_exist(component);
	});

	it("should finalize with updateable false when no updateable components were added", () => {
		const entity = new Entity();
		const flags = entity.finalize(undefined!);

		expect.falsy(flags.hasOnUpdate);
	});

	it("should finalize with updateable true when a updateable component was added", () => {
		const entity = new Entity();
		entity.addComponent(new UpdateableComponent());

		const flags = entity.finalize(undefined!);

		expect.truthy(flags.hasOnUpdate);
	});

	it("should finalize with drawable false when no drawable components were added", () => {
		const entity = new Entity();
		const flags = entity.finalize(undefined!);

		expect.falsy(flags.hasOnRender);
	});

	it("should finalize with drawable true when a drawable component was added", () => {
		const entity = new Entity();
		entity.addComponent(new RenderableComponent());

		const flags = entity.finalize(undefined!);

		expect.truthy(flags.hasOnRender);
	});

	it("should update updateable components when finalized", () => {
		const entity = new Entity();

		let wasUpdated = false;
		entity.addComponent(
			new UpdateableComponent(() => {
				wasUpdated = true;
			}),
		);
		entity.finalize(undefined!);

		entity.onUpdate(0);

		expect.truthy(wasUpdated);
	});

	it("should draw renderables components when finalized", () => {
		const entity = new Entity();

		let wasDrawn = false;
		entity.addComponent(
			new RenderableComponent(() => {
				wasDrawn = true;
			}),
		);
		entity.finalize(undefined!);

		entity.onRender(0);

		expect.truthy(wasDrawn);
	});
});
