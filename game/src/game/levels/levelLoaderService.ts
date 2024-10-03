import { Service } from "../../core/service";
import { LayerBuilder } from "../builders/layerBuilder";
import { PlayerBuilder } from "../builders/playerBuilder";
import { CameraService } from "../rendering/cameraService";

export class LevelLoaderService extends Service {
	private cameraService!: CameraService;

	private playerBuilder = new PlayerBuilder();
	private layerBuilder = new LayerBuilder();

	constructor() {
		super();

		ldtk.onLevelLoaded = (level) => this.onLevelLoaded(level);
		ldtk.onEntity = (entity) => this.onEntity(entity);
		ldtk.onLayer = (layer) => this.onLayer(layer);
		ldtk.onLevelCreated = (layer) => this.onLevelCreated(layer);

		ldtk.load("assets/map.ldtk");
	}

	public override onFinalize(): void {
		this.cameraService = this.inject(CameraService);

		ldtk.level("Level_0");
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private onLevelLoaded(level: LdtkLevel): void {}

	private onEntity(entity: LdtkEntity): void {
		if (entity.id === "Player") {
			const player = this.scene.addEntity(this.playerBuilder, {
				x: entity.x,
				y: entity.y,
			});

			this.cameraService.startFollowing(player, true);
		}
	}

	private onLayer(layer: LdtkLayer): void {
		this.scene.addEntity(this.layerBuilder, {
			layer: layer,
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private onLevelCreated(level: LdtkLevel): void {}
}
