import { Entity } from "./entity";

export abstract class Builder<TProps> {
	public abstract build(props: TProps): Entity;
}
