import { Builder } from "./core/builder";
import { Component } from "./core/component";
import { Entity } from "./core/entity";
import { Scene } from "./core/scene";

export function game() {
	class Bar extends Component {
		public x = 10;
	}

	class Foo extends Component {
		public bar!: Bar;

		public onFinalize(): void {
			this.bar = this.entity.getComponent(Bar);
		}
	}

	class EntityBuilder extends Builder<undefined> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public build(props: undefined): Entity {
			return new Entity()
				.addComponent(new Bar())
				.addComponent(new Foo());
		}

	}

	const scene = new Scene();
	const entity = scene.addEntity(new EntityBuilder(), undefined);

	print(entity.getComponent(Foo).bar.x);
}
