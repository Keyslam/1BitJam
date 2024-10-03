import { Service } from "../../core/service";
import { LayerBuilder } from "../builders/layerBuilder";
import { PlayerBuilder } from "../builders/playerBuilder";
import { CameraService } from "../rendering/cameraService";
import { TilemapService } from "./tilemapService";

export class LevelLoaderService extends Service {
	private cameraService!: CameraService;
	private tilemapService!: TilemapService;

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
		this.tilemapService = this.inject(TilemapService);

		ldtk.level("Level_0");
	}

	private onLevelLoaded(level: LdtkLevel): void {
		this.tilemapService.setDimensions(Math.ceil(level.width / TilemapService.tileSize), Math.ceil(level.height / TilemapService.tileSize));
	}

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

		for (const tile of layer.tiles) {
			this.tilemapService.setTile( //
				Math.ceil(tile.px[0] / TilemapService.tileSize),
				Math.ceil(tile.px[1] / TilemapService.tileSize),
				{
					top: 0,
					left: 0,
					right: 16,
					bottom: 16,
				}
			);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private onLevelCreated(level: LdtkLevel): void {}
}
