import { Accessory, Categories, uuid } from "hap-nodejs";

interface IHomeKitConfig {
  Username: string;
  PinCode: string;
  Port: number;
}

export class HomeKitExtension {
  public static Accessory;
  public static Configuration: IHomeKitConfig

  public static async Setup(config: any): Promise<void> {
    HomeKitExtension.Configuration = config;
    HomeKitExtension.Accessory = new Accessory("SmartHut", uuid.generate("smart-hut-extension-homekit"));
  }

  public static Start() {
    HomeKitExtension.Accessory.publish({
      username: HomeKitExtension.Configuration.Username,
      pincode: HomeKitExtension.Configuration.PinCode,
      port: HomeKitExtension.Configuration.Port,
      category: Categories.BRIDGE
    });
  }
}