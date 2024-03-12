import BaseScene from "../../../Script/Core/BaseScene";
import VQMM_Socket from "./Network/VQMM_Socket";
import VQMM_Wheel from "./Components/VQMM_Wheel";
import { GameSettings } from '../Data/VQMM_Settings'
import { CustomerData, PlayerData } from "./Virtual/VQMM_VirtualData";
import { ICustomerData, IPlayerData } from "./Virtual/VQMM_IVirtualData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class VQMM_Main extends BaseScene {
    socket = VQMM_Socket.gI();
    @property(cc.Label)
    public lblUserName: cc.Label = null;
    @property(cc.Label)
    public lblUserPhone: cc.Label = null;
    @property(cc.Label)
    public lblUserID: cc.Label = null;
    @property(VQMM_Wheel)
    public wheel: VQMM_Wheel = null;
    // @property(cc.Asset)
    // gameSettings: cc.Asset = null;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    onLoad() {
        this.init();
    }

    init() {
        const virtualPlayerData = PlayerData;
        this.parsePlayerData(virtualPlayerData);
        const virtualCustomerList = CustomerData;
        this.parseCustomerList(virtualCustomerList);
    }

    parsePlayerData(data: IPlayerData) {
        this.lblUserID.string = "ID: " + data.id + "";
        this.lblUserName.string = "Tên: " + data.name + "";
        this.lblUserPhone.string = "SĐT: " + data.phone + "";
    }

    parseCustomerList(data: ICustomerData) {
        for (let i in data) {
            const item = cc.instantiate(this.scrollView.content.getChildByName('item'));
            this.scrollView.content.addChild(item);
            item.setPosition(0, 0);
            item.getComponent(cc.Label).string = data[i].name + "";
        }
    }

    spinWheel(){
        const virtualResults = Math.floor(Math.random() * (GameSettings.segment - 1));
        this.wheel.spin(virtualResults);
    }
}
