import { Service } from "../../core/service";
import { BoundingBox } from "../physics/boundingBox";

export interface Tile {
	boundingBox: BoundingBox;
	state: "solid" | "one-way" | "open";
}

export class TilemapService extends Service {
	public static tileSize: number = 16;

	private width: number = 0;
	private height: number = 0;
	private tiles: Tile[] = [];

	public setDimensions(width: number, height: number): void {
		this.width = width;
		this.height = height;
	}

	public setTile(x: number, y: number, boundingBox: BoundingBox): void {
		const key = this.coordToKey(x, y);
		this.tiles[key] = {
			boundingBox: boundingBox,
			state: "solid",
		};
	}

	public getTile(x: number, y: number): Tile {
		return this.getTileByKey(this.coordToKey(x, y));
	}

	public getTileByKey(key: number): Tile {
		return this.tiles[key];
	}

	public query(boundingBox: BoundingBox, offsetX: number, offsetY: number, ignoreOneWay: boolean = false): boolean {
		const newTop = offsetY + boundingBox.top;
		const newLeft = offsetX + boundingBox.left;
		const newBottom = offsetY + boundingBox.bottom - 1;
		const newRight = offsetX + boundingBox.right - 1;

		const startTileX = Math.floor(newLeft / TilemapService.tileSize);
		const endTileX = Math.floor(newRight / TilemapService.tileSize);
		const startTileY = Math.floor(newTop / TilemapService.tileSize);
		const endTileY = Math.floor(newBottom / TilemapService.tileSize);

		for (let tileY = startTileY; tileY <= endTileY; tileY++) {
			for (let tileX = startTileX; tileX <= endTileX; tileX++) {
				const key = this.coordToKey(tileX, tileY);
				const tile = this.tiles[key];

				if (tile === undefined) {
					continue;
				}

				if (tile.state === "open") {
					continue;
				}

				if (tile.state === "one-way" && ignoreOneWay) {
					continue;
				}

				const tileTop = tileY * TilemapService.tileSize + tile.boundingBox.top - 1;
				if (tile.state === "one-way") {
					if (newBottom - 1 > tileTop) {
						continue;
					}
				}

				const tileLeft = tileX * TilemapService.tileSize + tile.boundingBox.left - 1;
				const tileBottom = tileTop + tile.boundingBox.bottom + 1;
				const tileRight = tileLeft + tile.boundingBox.right + 1;

				if (newLeft < tileRight && newRight > tileLeft && newTop < tileBottom && newBottom > tileTop) {
					return false;
				}
			}
		}

		return true;
	}

	private coordToKey(x: number, y: number): number {
		return x + y * this.width;
	}

	private keyToCoord(key: number): { x: number; y: number } {
		const y = Math.floor(key / this.width);
		const x = key - y * this.width;
		return { x, y };
	}
}
