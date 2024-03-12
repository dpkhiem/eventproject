
const {ccclass, property} = cc._decorator;

@ccclass
export default class Debug extends cc.Component {
    public static instance: Debug = null;

    @property(cc.Label) lblAngle: cc.Label = null;
    @property(cc.Label) lblTime: cc.Label = null;

    // onLoad () {}

    start () {
        Debug.instance = this;
    }

    // update (dt) {}
}
