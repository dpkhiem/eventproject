import {PTMessage} from "../../../../Script/Network/PTMessage";
import VQMM_Socket from "./VQMM_Socket";
import VQMM_CMD from "./VQMM_CMD";
import SocketCommandManager from "../../../../Script/Network/SocketCommandManager";

export default class VQMM_Sender {
    public static instance: VQMM_Sender = null;
    private arrMess: PTMessage[] = [];

    public static gI() {
        if (this.instance == null) {
            this.instance = new VQMM_Sender();
        }
        return this.instance;
    }

    public closeSocket() {
        VQMM_Socket.gI().close();
    }

    public sendNoLoginMsg(mess) {
        VQMM_Socket.gI().send(mess);
    }

    public saveMess(mess: PTMessage) {
        this.arrMess.push(mess);
    }

    public sendMsg(mess, isSave: boolean = false) {
        //if (PTGameConfig.isLoginSuccess) VQMM_Socket.gI().send(mess);
        //else if (isSave) this.saveMess(mess);
        if (true) VQMM_Socket.gI().send(mess);
        else if (isSave) this.saveMess(mess);
    }

    public sendMsgJoinGame() {
        const mess = new PTMessage();
        mess.writeByte(SocketCommandManager.CMD_POKER_MEGA);
        mess.writeByte(VQMM_CMD.JOIN_ROOM);
        this.sendMsg(mess);
    }
}
