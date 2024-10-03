import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { LambdaRenderer } from "../rendering/lambdaRenderer";

export interface LayerProps {
	layer: LdtkLayer;
}

export class LayerBuilder extends Builder<LayerProps> {
	public build(props: LayerProps): Entity {
		return new Entity( //
			new Position(0, 0),
			new LambdaRenderer(() => {
				props.layer.draw();
			})
		)
	}
}
