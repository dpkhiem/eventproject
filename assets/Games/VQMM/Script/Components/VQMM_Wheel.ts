import { DEBUG, GameSettings } from "../../Data/VQMM_Settings";
import VQMM_Debug from "./VQMM_Debug";

const {ccclass, property} = cc._decorator;

const CIRCLE_DEGREE = 360;

@ccclass
export default class VQMM_Wheel extends cc.Component {
    @property(cc.Node) circle: cc.Node = null;
    @property(cc.Node) arrow: cc.Node = null;
    @property(cc.Button) btnSpin: cc.Button = null;
    
    segmentCount: number = 0;
    segmentAngle: number = 0;
    speed: number = 0;
    acceleration: number = 0;
    isSpinning: boolean = false;

    public get angle() {
        return this.circle.angle;
    }

    public set angle(angle: number) {
        this.circle.angle = angle;
    }

    public get IsSpinning() {
        return this.isSpinning;
    }

    public set IsSpinning(value: boolean) {
        this.isSpinning = value;

        this.btnSpin.interactable = !this.isSpinning;
        this.btnSpin.node.getComponentInChildren(cc.Label).string = this.isSpinning ? "Spinning" : "Spin";
    }

    // onLoad () {}

    start () {
        this.init();
    }

    init() {
        this.segmentCount = GameSettings.segment;
        this.speed = GameSettings.speed;
        this.segmentAngle = CIRCLE_DEGREE/this.segmentCount;
        this.angle = (this.segmentAngle)/2; // start angle
        this.createSegment();
    }

    createSegment() {
        for (let i = 0; i < this.segmentCount; i++) {
            const crossBar: cc.Node = cc.instantiate(this.circle.getChildByName('cross_bar'));
            this.circle.addChild(crossBar);
            crossBar.setPosition(0, 0);
            crossBar.angle = -(this.segmentAngle * i);
            crossBar.active = true;
            const label = crossBar.getChildByName('Label').getComponent(cc.Label);
            label.string = i + "";
        }
    }

    setFinishAngle(rewardId: number){
        let angle = (rewardId + 0.3 + Math.random() * 0.4) * CIRCLE_DEGREE / this.segmentCount;
        let curAngle = this.angle % 360;
        let speed = this.speed; //dregee/s
        let s = GameSettings.rotationCount * CIRCLE_DEGREE + (angle - curAngle);
        let a = -speed * speed / 2 / s;
        this.acceleration = a;
    }

    spin(rewardId: number) {
        if (DEBUG) {
            rewardId = parseInt(VQMM_Debug.instance.inputRewardId.string);
            VQMM_Debug.instance.reset();
            VQMM_Debug.instance.setRewardId(rewardId);
            VQMM_Debug.instance.playTime();
        }
        const setback = 7;
        cc.tween(this.circle)
            // .by(0.3, { angle: setback }, { easing: "easeInOutExpo" })
            // .by(0.2, { angle: -setback})
            .call(()=>{
                this.speed = GameSettings.speed;
                this.setFinishAngle(rewardId);
                this.IsSpinning = true;
            })
            .start();
    }

    update (dt: number) {
        if (!this.IsSpinning) return;
        DEBUG && VQMM_Debug.instance.setAngle(this.angle);

        if (this.speed > 0) {
            this.angle += (this.speed * dt);
            this.speed += (this.acceleration * dt);
        } else {
            this.IsSpinning = false;
            DEBUG && VQMM_Debug.instance.playTime(true);
        }
    }
}
