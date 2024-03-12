import {AuthSocket} from "../Network/Auth/AuthSocket";
const {ccclass} = cc._decorator;

export interface IBaseScene {
    socket: AuthSocket
}

@ccclass
export default class BaseScene extends cc.Component implements IBaseScene {
    socket: AuthSocket;
}
