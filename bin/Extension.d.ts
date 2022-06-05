interface IHomeKitConfig {
    Username: string;
    PinCode: string;
    Port: number;
}
export declare class HomeKitExtension {
    static Accessory: any;
    static Configuration: IHomeKitConfig;
    static Setup(config: any): Promise<void>;
    static Start(): void;
}
export {};
