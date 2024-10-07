import { Service } from "../../core/service";
import { LayerBuilder } from "../builders/layerBuilder";
import { PlayerBuilder } from "../builders/playerBuilder";
import { ShroomBuilder } from "../builders/shroomBuilder";
import { SpikebugBuilder } from "../builders/spikebugBuilder";
import { CameraService } from "../rendering/cameraService";
import { TilemapService } from "./tilemapService";

export class LevelLoaderService extends Service {
	private cameraService!: CameraService;
	private tilemapService!: TilemapService;

	private playerBuilder = new PlayerBuilder();
	private shroomBuilder = new ShroomBuilder();
	private spikebugBuilder = new SpikebugBuilder();
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
	}

	public load(name: string): void {
		ldtk.level(name);
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

		if (entity.id === "Shroom") {
			this.scene.addEntity(this.shroomBuilder, {
				x: entity.x,
				y: entity.y,
			});
		}

		if (entity.id === "Spikebug") {
			this.scene.addEntity(this.spikebugBuilder, {
				x: entity.x,
				y: entity.y,
			});
		}
	}

	private onLayer(layer: LdtkLayer): void {
		this.scene.addEntity(this.layerBuilder, {
			layer: layer,
		});

		for (const tile of layer.tiles) {
			if (tile.t === 26 || tile.t === 89 || tile.t === 108) {
				this.tilemapService.setTile( //
					Math.ceil(tile.px[0] / TilemapService.tileSize),
					Math.ceil(tile.px[1] / TilemapService.tileSize),
					(bb) => {
						if (bb.bottom > (TilemapService.tileSize - 1 - bb.right)) {
							return true;
						}

						return false;
					},
					"slope-right",
				);
			} else if (tile.t === 27 || tile.t === 90 || tile.t === 111) {
				this.tilemapService.setTile( //
					Math.ceil(tile.px[0] / TilemapService.tileSize),
					Math.ceil(tile.px[1] / TilemapService.tileSize),
					(bb) => {
						if (bb.bottom > bb.left) {
							return true;
						}

						return false;
					},
					"slope-left",
				);
			} else {
				this.tilemapService.setTile( //
					Math.ceil(tile.px[0] / TilemapService.tileSize),
					Math.ceil(tile.px[1] / TilemapService.tileSize),
					{
						top: 0,
						left: 0,
						right: 16,
						bottom: 16,
					},
					"solid"
				);
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private onLevelCreated(level: LdtkLevel): void {
		this.cameraService.setBounds(level.width, level.height);
	}
}
