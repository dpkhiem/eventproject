import { GameSettings } from "../../Data/VQMM_Settings";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VQMM_Debug extends cc.Component {
    public static instance: VQMM_Debug = null;

    @property(cc.Label) lblAngle: cc.Label = null;
    @property(cc.Label) lblTime: cc.Label = null;
    @property(cc.Label) lblRewardId: cc.Label = null;
    @property(cc.EditBox) inputRewardId: cc.EditBox = null;

    isRunning: boolean = false;
    currentTime: number = 0;

    // onLoad () {}

    start () {
        VQMM_Debug.instance = this;
    }

    playTime(stop?: boolean) {
        this.isRunning = stop ? false : true;
    }

    setAngle(angle: number) {
        this.lblAngle.string = Math.floor(angle) + "";
    }

    setTime(time: number) {
        this.lblTime.string = Math.floor(time) + "";
    }

    setRewardId(id: number) {
        this.lblRewardId.string = id + "";
    }

    checkInput() {
        const input = parseInt(this.inputRewardId.string);
        if (isNaN(input) || input < 0 || input > GameSettings.segment-1) {
            this.inputRewardId.string = 0 + "";
            return;
        }
    }

    reset() {
        this.currentTime = 0;
        this.lblAngle.string = "0";
        this.lblTime.string = "0";
        this.lblRewardId.string = "0";
    }

    update (dt: number) {
        if (!this.isRunning) return;
        this.currentTime += dt;
        this.setTime(this.currentTime);
    }
}
