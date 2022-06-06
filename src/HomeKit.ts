import { CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, Service } from "hap-nodejs";
import { Reflection } from "@kezziny/reflection";
import { DataBindingConverter, DataPublishingConverter, Device, DeviceExtension, IDeviceConfig } from "@kezziny/smart-hut";
import { HomeKitExtension } from "./Extension";

export { Characteristic } from "hap-nodejs";

export enum HomeKitDevice {
	Light,
	Blind
}

export class HomeKit extends DeviceExtension {
	private static readonly KeyBind = "HomeKit.Bind";
	private static readonly KeyPublish = "HomeKit.Publish";

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

		this.Device.GetPropertiesWithMetadata(HomeKit.KeyPublish)
			.forEach(property => {
				let characteristic = this.Service.getCharacteristic(property.Metadata.characteristic);
				characteristic.on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
					let value = this.Device[property.Name].Value?.value;
					if (property.Metadata.converter) value = this.Device.ExecutePublishingCallback(property.Metadata.converter, property.Name);
					callback(undefined, value);
				});
			});
		this.Device.GetPropertiesWithMetadata(HomeKit.KeyBind)
			.forEach(property => {
				let characteristic = this.Service.getCharacteristic(property.Metadata.characteristic);
				characteristic.on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
					this.Device.ExecuteBindingCallback(property.Metadata.callback, value);
					callback();
				});
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

	public static Bind(characteristic: any, converter: DataBindingConverter<any> = null) {
		return function (device: Device, property: string) {
			Reflection.SetPropertyMetadata(device, property, HomeKit.KeyBind, { characteristic, converter });
		}
	}

	public static Publish(characteristic: any, converter: DataPublishingConverter = null) {
		return function (device: Device, property: string) {
			Reflection.SetPropertyMetadata(device, property, HomeKit.KeyPublish, { characteristic, converter });
		}
	}

	public static BindAndPublish(characteristic: any, bindingConverter: DataBindingConverter<any> = null, publishingConverter: DataPublishingConverter = null) {
		return function (device: Device, property: string) {
			Reflection.SetPropertyMetadata(device, property, HomeKit.KeyBind, { characteristic, bindingConverter });
			Reflection.SetPropertyMetadata(device, property, HomeKit.KeyPublish, { characteristic, publishingConverter });
		}
	}

	
}
