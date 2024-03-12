
const {ccclass, property} = cc._decorator;

@ccclass
export default class VQMM_Wheel extends cc.Component {
    @property(cc.Node) circle: cc.Node = null;
    @property(cc.Node) arrow: cc.Node = null;
    @property(cc.Button) btnSpin: cc.Button = null;
    
    private segmentCount: number = 0;
    private speed: number = 0;
    private angle: number = 0;

    public get Angle() {
        return this.angle;
    }

    public set Angle(angle: number) {
        this.angle = angle;
    }

    // onLoad () {}

    start () {
        
    }

    init() {

    }

    // update (dt) {}
}
