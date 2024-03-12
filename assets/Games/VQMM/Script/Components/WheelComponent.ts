
const {ccclass, property} = cc._decorator;

@ccclass
export default class WheelComponent extends cc.Component {
    @property(cc.Node) circle = null;
    @property(cc.Integer) duration: number = 3;
    @property(cc.Integer) segmentCount: number = 8;
    @property(cc.Node) raw: Node = null;
    @property(cc.Label) labelTest: cc.Label = null;
    @property(cc.EditBox) input: cc.EditBox = null;

    @property
    speed = 100;
    radius = 0;
    startAngle = 0;
    isSpinning = false;
    isResult = false;
    _time = 5;
    _rTime = 1;
    accel = 0;

    _resultAngle = 0;

    get angle(){
        return this.circle.angle;
    }
    set angle(v){
        this.circle.angle = v;
    }



    @property
    public set StartAngle(value: number) {
        this.startAngle = value;
        this.circle.angle = - value;
    }

    onLoad() {
        this.radius = 360 / this.segmentCount;
        this.startAngle = this.radius/2;
        this.circle.angle = this.startAngle;
        this.createCircle(this.segmentCount);
        console.log(cc.misc.degreesToRadians(this.circle.angle))
    }
    clickStart(){
        this.speed = 500;
        this.clickStop();
    }
    clickStop(){
        this.setFinishAngle(3);
    }
    setFinishAngle(id){
        let angle = (id+0.3+Math.random()*0.4) * 360/this.segmentCount;
        let curAngle = this.angle % 360;
        let speed = this.speed;//dregee/s
        let s = 20 * 360 + (angle - curAngle);
        let a = -speed*speed/2/s;
        this.accel = a;
    }

    createCircle(segmentCount: number) {
        for (let i = 0; i < segmentCount; i++) {
            const raw: any = cc.instantiate(this.raw);
            this.circle.addChild(raw);
            raw.setPosition(0, 0);
            raw.angle = -(this.radius * i);
            raw.active = true;
            const label = raw.getChildByName('Label').getComponent(cc.Label);
            label.string = i + "";
            // label.node.setPosition()
        }
        console.log(
            "angle: ", this.circle.angle,
            "rotation: ", this.circle.rotation
        )
    }

    spin(rewardId: number) {
        if (this.input.string != "") {
            rewardId = parseInt(this.input.string)
        }
        
        this._resultAngle = (rewardId * this.radius) + (360 * this.duration);
        this.accel = this._resultAngle;
        this._time = this._resultAngle / this.speed;
        this._rTime = this._time;

        const backDegree = 17;
        const angleSimulate = -(360 * this.duration + backDegree);
        const durationSimulate = Math.abs(angleSimulate)/this.speed;
        const angle = -(rewardId * this.radius + this.startAngle);
        const duration = Math.abs(angle)/this.speed;
        cc.tween(this.circle)
            .by(0.3, { angle: backDegree }, { easing: "easeInOutExpo" })
            .call(()=>{this.isSpinning = true})
            .by(durationSimulate, { angle: angleSimulate }, { easing: "easeInBack" })
            .call(()=>{this.circle.angle = this.startAngle})
            .by(duration, { angle: angle }, { easing: "easeInBack" })
            .call(()=>{
                this.isSpinning = false;
                this.startAngle = this.circle.angle;
            })
            .start()
        console.log(angleSimulate, angle)
    }

    getAngleResult(idReward: number): number[] {
        const angle = idReward*this.radius;
        console.log(angle, angle + this.radius)
        return [-angle, -(angle + this.radius)];
    }

    updateTime(dt: number) {
        if (this._time <= this._time/2) {
            this.isResult = true;
            return;
        }
        this._time -= dt;
        
    }

    test() {
        this.accel = (0 - 300) / (5);
    }

    update(dt: number) {
        // if (!this.isSpinning) return;
        // this.updateTime(dt);
        // if (this.isResult) {
        //     const rangeAngle = this.getAngleResult(2);
        //     const result = rangeAngle[0] + 360;
        //     // this.circle.angle -= dt * this.speed;
        //     if (cc.misc.degreesToRadians(this.circle.angle) <= rangeAngle[0] && cc.misc.degreesToRadians(this.circle.angle) >= rangeAngle[1]) {
        //         this._rTime -= dt;
        //         this.circle.angle -= dt * this.speed * this._rTime;
        //         if (this._rTime <= 0) {
        //             this.isSpinning = false;
        //         }
        //         return;
        //     }
        // }

        // this._rTime -= dt;
        // if (this._rTime <= 0) return;
        // this.circle.angle -= (dt * this.speed) * (this._rTime / this._time);
        // this.labelTest.string = Math.floor(this.circle.angle) + "";

        if(this.speed > 0){
            this.angle += this.speed * dt;
            this.speed += this.accel*dt;
        }
    }
}
 
