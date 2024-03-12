import VQMM_CMD from "./VQMM_CMD";
import SocketCommandManager from "../../../../Script/Network/SocketCommandManager";
import {AuthSocket} from "../../../../Script/Network/Auth/AuthSocket";

export default class VQMM_Socket extends AuthSocket {
    protected get CMD_LOGIN(): number {
        return VQMM_CMD.LOGIN;
    }

    protected get CMD_DISCONNECT_LOGIN_CONFLICT(): number {
        return VQMM_CMD.DISCONNECT_LOGIN_CONFLICT;
    }

    protected get CMD_SESSION_TIME_OUT(): number {
        return VQMM_CMD.SESSION_TIME_OUT;
    }

    protected get CMD_PING_WIFI(): number {
        return SocketCommandManager.PING_WIFI;
    }

    private static instance: VQMM_Socket = null;

    /**
     * gets instance of FishSocket
     */
    public static gI(): VQMM_Socket {
        if (this.instance == null) {
            this.instance = new VQMM_Socket();
        }
        return this.instance;
    }
}
