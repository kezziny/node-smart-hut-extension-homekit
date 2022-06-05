import { CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, Service } from "hap-nodejs";
import { Reflection } from "reflection";
import { Device, DeviceExtension, IDeviceConfig } from "smart-hut";
import { HomeKitExtension } from "./Extension";

export { Characteristic } from "hap-nodejs";

export enum HomeKitDevice {
	Light,
	Blind
}

export class HomeKit extends DeviceExtension {
	private static readonly BindKey = "HomeKit.Bind";

	private Type: HomeKitDevice;
	private Service;

	constructor(device: Device, type: HomeKitDevice) {
		super(device);
		this.Type = type;
	}

	public override Configure(config: IDeviceConfig): void {
		super.Configure(config);

		let name = `${this.Configuration.Room} ${this.Configuration.Name}`;
		switch (this.Type) {
			case HomeKitDevice.Light: this.Service = new Service.Lightbulb(name, name); break;
			case HomeKitDevice.Blind: this.Service = new Service.WindowCovering(name, name); break;
		}

		this.Device.GetPropertiesWithMetadata(HomeKit.BindKey)
			.forEach(property => {
				let characteristic = this.Service.getCharacteristic(property.Metadata.characteristic);
				characteristic.on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
					callback(undefined, this.Device[property.Name].Value?.value);
				});
				if (property.Metadata.callback) {
					characteristic.on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
						this.Device.ExecuteCallback(property.Metadata.callback, value);
						callback();
					});
				}
			});

		HomeKitExtension.Accessory.addService(this.Service);
	}

	public static Extension(type: HomeKitDevice) {
		return function <T extends { new(...args: any[]): Device }>(constructor: T) {
			return class extends constructor {
				constructor(...args: any[]) {
					super(args);
					this.Extensions.push(new HomeKit(this, type));
				}
			};
		};
	}

	public static Bind(characteristic: any, callback: any = null) {
		return function (device: Device, property: string) {
			Reflection.SetPropertyMetadata(device, property, HomeKit.BindKey, { characteristic, callback });
		}
	}
}