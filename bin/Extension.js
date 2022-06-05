"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeKitExtension = void 0;
const hap_nodejs_1 = require("hap-nodejs");
class HomeKitExtension {
    static Setup(config) {
        return __awaiter(this, void 0, void 0, function* () {
            HomeKitExtension.Configuration = config;
            HomeKitExtension.Accessory = new hap_nodejs_1.Accessory("SmartHut", hap_nodejs_1.uuid.generate("smart-hut-extension-homekit"));
        });
    }
    static Start() {
        HomeKitExtension.Accessory.publish({
            username: HomeKitExtension.Configuration.Username,
            pincode: HomeKitExtension.Configuration.PinCode,
            port: HomeKitExtension.Configuration.Port,
            category: 2 /* Categories.BRIDGE */
        });
    }
}
exports.HomeKitExtension = HomeKitExtension;
