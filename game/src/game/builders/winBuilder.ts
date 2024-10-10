import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { WinText } from "../behaviours/winText";
import { Position } from "../common/position";

export class WinBuilder extends Builder<undefined> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public build(props: undefined): Entity {
		return new Entity( //
			new Position(0, 0),
			new WinText()
		)
	}
}
