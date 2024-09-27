import { describe, expect, it } from "../libraries/lester/lester";
import { Component } from "./component";
import { Entity } from "./entity";

class TestComponent extends Component {}

describe("entity", () => {
	it("should be able get component after adding it", () => {
		const entity = new Entity();
		entity.addComponent(new TestComponent());

		const component = entity.getComponent(TestComponent);

		expect.exist(component);
	});

	it("should throw error when updating when not finalized", () => {
		const entity = new Entity();
		expect.fail(() => entity.update(0), undefined);
	});

	it("should throw error when drawing when not finalized", () => {
		const entity = new Entity();
		expect.fail(() => entity.draw(), undefined);
	});
});
