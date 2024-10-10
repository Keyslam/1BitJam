import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Text } from "../behaviours/text";
import { Position } from "../common/position";

export class PlotBuilder extends Builder<undefined> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public build(props: undefined): Entity {
		return new Entity( //
			new Position(0, 0),
			new Text()
		)
	}
}
