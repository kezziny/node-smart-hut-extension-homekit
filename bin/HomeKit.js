"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeKit = exports.HomeKitDevice = exports.Characteristic = void 0;
const hap_nodejs_1 = require("hap-nodejs");
const reflection_1 = require("@kezziny/reflection");
const smart_hut_1 = require("@kezziny/smart-hut");
const Extension_1 = require("./Extension");
var hap_nodejs_2 = require("hap-nodejs");
Object.defineProperty(exports, "Characteristic", { enumerable: true, get: function () { return hap_nodejs_2.Characteristic; } });
var HomeKitDevice;
(function (HomeKitDevice) {
    HomeKitDevice[HomeKitDevice["Light"] = 0] = "Light";
    HomeKitDevice[HomeKitDevice["Blind"] = 1] = "Blind";
})(HomeKitDevice = exports.HomeKitDevice || (exports.HomeKitDevice = {}));
class HomeKit extends smart_hut_1.DeviceExtension {
    constructor(device, type) {
        super(device);
        this.Type = type;
    }
    Configure(config) {
        super.Configure(config);
        let name = `${this.Configuration.Room} ${this.Configuration.Name}`;
        switch (this.Type) {
            case HomeKitDevice.Light:
                this.Service = new hap_nodejs_1.Service.Lightbulb(name, name);
                break;
            case HomeKitDevice.Blind:
                this.Service = new hap_nodejs_1.Service.WindowCovering(name, name);
                break;
        }
        this.Device.GetPropertiesWithMetadata(HomeKit.BindKey)
            .forEach(property => {
            let characteristic = this.Service.getCharacteristic(property.Metadata.characteristic);
            characteristic.on("get" /* CharacteristicEventTypes.GET */, (callback) => {
                var _a;
                callback(undefined, (_a = this.Device[property.Name].Value) === null || _a === void 0 ? void 0 : _a.value);
            });
            if (property.Metadata.callback) {
                characteristic.on("set" /* CharacteristicEventTypes.SET */, (value, callback) => {
                    this.Device.ExecuteCallback(property.Metadata.callback, value);
                    callback();
                });
            }
        });
        Extension_1.HomeKitExtension.Accessory.addService(this.Service);
    }
    static Extension(type) {
        return function (constructor) {
            return class extends constructor {
                constructor(...args) {
                    super(args);
                    this.Extensions.push(new HomeKit(this, type));
                }
            };
        };
    }
    static Bind(characteristic, callback = null) {
        return function (device, property) {
            reflection_1.Reflection.SetPropertyMetadata(device, property, HomeKit.BindKey, { characteristic, callback });
        };
    }
}
exports.HomeKit = HomeKit;
HomeKit.BindKey = "HomeKit.Bind";
