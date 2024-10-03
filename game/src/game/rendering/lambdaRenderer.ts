import { Component } from "../../core/component";
import { RenderService } from "./renderService";

export class LambdaRenderer extends Component {
	private renderService!: RenderService;

	private lambda: () => void;

	constructor(lambda: () => void) {
		super();

		this.lambda = lambda;
	}

	public override onFinalize(): void {
		this.renderService = this.injectService(RenderService);
	}

	public override onRender() {
		this.renderService.drawLambda(this.lambda, "background");
	}
}
