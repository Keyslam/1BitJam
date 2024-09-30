import { Scene } from "./scene";

export class SceneOrchestrator {
	private scenes: Scene[] = [];

	public loadScene(scene: Scene) {
		this.scenes.push(scene);
	}

	public onFixedUpdate() {
		for (const scene of this.scenes) {
			scene.onFixedUpdate();
		}
	}

	public onUpdate(dt: number) {
		for (const scene of this.scenes) {
			scene.onUpdate(dt);
		}
	}

	public onRender(interpolation: number) {
		for (const scene of this.scenes) {
			scene.onRender(interpolation);
		}
	}

	public onGui(interpolation: number) {
		for (const scene of this.scenes) {
			scene.onGui(interpolation);
		}
	}
}
