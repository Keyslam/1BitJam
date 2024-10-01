import { Image } from "love.graphics";
import { Service } from "../../core/service";

export class ResourceService extends Service {
	private images: Record<string, Image> = {};

	public getImage(name: string): Image {
		if (this.images[name] !== undefined) {
			return this.images[name];
		}

		const image = love.graphics.newImage(`assets/${name}`);
		this.images[name] = image;

		return image;
	}
}
