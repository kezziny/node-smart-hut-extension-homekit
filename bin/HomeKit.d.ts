import { Device, DeviceExtension, IDeviceConfig } from "smart-hut";
export { Characteristic } from "hap-nodejs";
export declare enum HomeKitDevice {
    Light = 0,
    Blind = 1
}
export declare class HomeKit extends DeviceExtension {
    private static readonly BindKey;
    private Type;
    private Service;
    constructor(device: Device, type: HomeKitDevice);
    Configure(config: IDeviceConfig): void;
    static Extension(type: HomeKitDevice): <T extends new (...args: any[]) => Device>(constructor: T) => {
        new (...args: any[]): {
            Extensions: DeviceExtension[];
            Configuration: IDeviceConfig;
            Configure(config: IDeviceConfig): void;
            GetMethodsWithMetadata(key: string): import("reflection").IMethodInfo[];
            ExecuteCallback(callback: any, ...args: any[]): void;
            GetProperties(): string[];
            GetMethods(): string[];
            HasClassMetadata(key: string): any;
            GetClassMetadata(key: string): any;
            HasPropertyMetadata(property: string, key: string): any;
            GetPropertyMetadata(property: string, key: string): any;
            GetPropertiesWithMetadata(key: string): import("reflection").IMethodInfo[];
            CallMethodsWithMetadata(key: string, ...args: any[]): void;
        };
    } & T;
    static Bind(characteristic: any, callback?: any): (device: Device, property: string) => void;
}
