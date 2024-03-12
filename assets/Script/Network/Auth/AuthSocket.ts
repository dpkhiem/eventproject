import SocketManager, {CloseCode, ISocket, SocketState} from "../SocketManager";
import LoginFailedResponse from "./LoginFailedResponse";
import LoginSuccessResponse from "./LoginSuccessResponse";
import {PTMessage} from "../PTMessage";
import LoginRequest from "./LoginRequest";
import Storage from "../../Storage/Storage";

interface IAuthSocketLoginData {
    token: string;
}

interface IAuthSocket extends ISocket {
    getLastLogin(): LoginSuccessResponse;

    getLastError(): LoginFailedResponse;

    sendMsgLogin(info: IAuthSocketLoginData, callback: (isSuccess: boolean, error: Error) => void);

    sendMsgLoginConflict(info: IAuthSocketLoginData, callback: (isSuccess: boolean, error: Error) => void);
}

export abstract class AuthSocket extends SocketManager implements IAuthSocket {
    public getLastLogin(): LoginSuccessResponse {
        return this.lastSuccess;
    }

    public getLastError(): LoginFailedResponse {
        return this.lastFailed;
    }

    private msgLoginTask: (isSuccess: boolean, error: Error) => void = null;
    private timeoutLoginHolder: any = null;
    private lastSuccess: LoginSuccessResponse = null;
    private lastFailed: LoginFailedResponse = null;

    protected abstract get CMD_LOGIN(): number;

    protected abstract get CMD_DISCONNECT_LOGIN_CONFLICT(): number;

    protected abstract get CMD_SESSION_TIME_OUT(): number;

    protected abstract get CMD_PING_WIFI(): number;

    private clearTimeoutLoginInterval() {
        if (this.timeoutLoginHolder != null) {
            clearTimeout(this.timeoutLoginHolder);
            this.timeoutLoginHolder = null;
        }
    }

    /**
     * invoked whenever socket opened.
     */
    protected handleOnOpen(ws: WebSocket, evt: Event) {
        super.handleOnOpen(ws, evt)
        if (this.getState() != SocketState.Connected) {
            this.resolveLoginTask(false, new Error("Websocket is opened but never opened normally, did you call ISocketManager.open()?"));
        }
    }

    /**
     * invoked whenever an error accured.
     */
    protected handleOnError(ws: WebSocket, evt: CloseEvent) {
        super.handleOnError(ws, evt);
        this.resolveLoginTask(false, new Error("WebSocket is error."));
    }

    /**
     * invoked whenever socket has been closed.
     */
    protected handleOnClose(ws: WebSocket, evt: CloseEvent) {
        super.handleOnClose(ws, evt);
        this.resolveLoginTask(false, new Error("Websocket is closed."));
    }

    protected handleMessage(message: PTMessage) {
        super.handleMessage(message);
        // cc.log("CMD :" + message.getCommand());
        switch (message.getCommand()) {
            case this.CMD_LOGIN: {
                if (this.msgLoginTask == null) {
                    cc.error('There is no login task to handle CMD.LOGIN.')
                    return;
                }

                let isOk = message.readBoolean();
                cc.log("[SocketManager] handleMessage:", isOk);
                if (!isOk) {
                    this.lastFailed = new LoginFailedResponse(message);
                    this.resetSocket();
                    this.resolveLoginTask(false, new Error("MSG_LOGIN_REJECT"));
                    //PTEventManager.fire2(PTEventManager.ON_MESSAGE_LOGOUT, this.lastFailed, message);
                } else {
                    this.lastSuccess = new LoginSuccessResponse(message);
                    this.setState(SocketState.Connected);
                    this.resolveLoginTask(true, null);
                    Storage.I().authenticated(this.lastSuccess.playerName, this.lastSuccess.playerPhone)
                    //PTEventManager.fire2(PTEventManager.ON_MESSAGE_LOGIN, this.lastSuccess, message);
                }
                break;
            }
            case this.CMD_DISCONNECT_LOGIN_CONFLICT: {
                this.setCloseCode(CloseCode.ServerKick);
                this.close();
                //PTEventManager.fire2(PTEventManager.ON_DISCONNECTED_CONFLICT, message);
                break;
            }
            case this.CMD_SESSION_TIME_OUT: {
                this.setCloseCode(CloseCode.ServerKick);
                this.close();
                //PTEventManager.fire2(PTEventManager.ON_TIME_OUT, message);
                break;
            }

            case this.CMD_PING_WIFI: {
                //PTPingWifiComp.gI().onReceive();
                break;
            }
        }
    }

    private resolveLoginTask(val: boolean, err: Error) {
        this.clearTimeoutLoginInterval();
        if (this.msgLoginTask != null) {
            const tmp = this.msgLoginTask;
            this.msgLoginTask = null;
            tmp(val, err);
        }
    }

    public sendMsgLogin(info: IAuthSocketLoginData, callback: (isSuccess: boolean, error: Error) => void) {
        this.lastSuccess = null;
        this.lastFailed = null;
        const self = this;
        const request = new LoginRequest();
        request.tokenLogin = info.token;
        request.versionName = "1.0";
        request.deviceId = "123";
        request.platformName = "WEB";
        request.languageType = 1;
        self.send(request.serialize());
        self.msgLoginTask = callback;
        this.clearTimeoutLoginInterval();
        self.timeoutLoginHolder = setTimeout(() => {
            self.resolveLoginTask(false, new Error("MSG_TIMEOUT_LOGIN"));
        }, 50000);
    }

    sendMsgLoginConflict(info: IAuthSocketLoginData, callback: (isSuccess: boolean, error: Error) => void) {
    }
}
