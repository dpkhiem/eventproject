import {PTMessage} from "./PTMessage";
import error = cc.error;

export enum SocketState {
    Init = 0,
    Connecting = 1,
    Connected = 2,
    Closed = 3,
}

export enum CloseCode {
    Normal = 0,
    ServerError = 1,
    ServerKick = 2,
}

export interface ISocket {
    // setCert(certUrl: string);
    setSocketUrl(socketUrl: string): void;

    getState(): SocketState;

    getCloseCode(): CloseCode;

    open(): void;

    close(): void;

    send(message: PTMessage): void;
}

export default class SocketManager implements ISocket {
    private static readonly SOCKET_BINARY_TYPE = 'arraybuffer';
    private socketUrl: string = 'ws://192.168.50.142:8600/sb';
    private socket: WebSocket = null;
    private pendingMessages: Array<PTMessage> = [];
    private state: SocketState = SocketState.Init;
    private closeCode: CloseCode = CloseCode.Normal;

    private get certUrl(): string {
        return null;
    }

    close(): void {
    }

    getCloseCode(): CloseCode {
        return undefined;
    }

    getState(): SocketState {
        return this.state;
    }

    /**
     * check if current platform is required a cert to connect.
     */
    private isCertRequired(): boolean {
        return false;
        return (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) ||
            cc.sys.os == cc.sys.OS_WINDOWS;
    }

    open(): void {
        if (this.state == SocketState.Connecting ||
            this.state == SocketState.Connected) {
            return;
        }
        if (!this.socketUrl || this.socketUrl === '') {
            throw 'SocketManager: url can not be null or empty.';
        }

        if (this.isCertRequired() && (!this.certUrl || this.certUrl === '')) {
            // throw 'SocketManager: cert is required on current platform.';
            //this.certUrl = Utils.wssCacert;
            error('SocketManager: cert is required on current platform.', this.certUrl, this.socketUrl)
        }

        if (this.isCertRequired()) {
            this.socket = new WebSocket(this.socketUrl, [], this.certUrl);
        } else {
            this.socket = new WebSocket(this.socketUrl, []);
        }

        this.state = SocketState.Connecting;
        this.closeCode = CloseCode.Normal;
        this.socket.binaryType = SocketManager.SOCKET_BINARY_TYPE;

        this.socket.onopen = this.handleOnOpen.bind(this);
        this.socket.onmessage = this.handleOnMessage.bind(this);
        this.socket.onerror = this.handleOnError.bind(this);
        this.socket.onclose = this.handleOnClose.bind(this);
    }

    send(message: PTMessage): void {
        if (this.state == SocketState.Init || this.state == SocketState.Closed) {
            this.pendingMessages.push(message);
            this.open();
            return;
        }

        if (this.state == SocketState.Connecting) {
            this.pendingMessages.push(message);
            return;
        }

        if (!this.socket || this.socket.readyState != WebSocket.OPEN) {
            cc.error('SocketManager: Invalid state, try to reset all.');
            this.socket = null;
            this.state = SocketState.Init;
            this.open();
            return;
        }
        var arr = message.getArrByte()
        var mess = new Int8Array(arr.length)
        for (var i = 0; i < mess.length; i++) {
            mess[i] = arr[i]
        }

        this.socket.send(mess)
        arr.length = 0
    }

    setSocketUrl(socketUrl: string): void {
        this.socketUrl = socketUrl;
    }

    /**
     * resets socket manager to default state.
     */
    protected resetSocket(stateAfter: SocketState = SocketState.Init) {
        if (this.socket != null) {
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onerror = null;
            this.socket.onclose = null;

            if (this.socket.readyState == WebSocket.OPEN) {
                this.socket.close();
            }
        }

        this.socket = null;
        this.state = stateAfter;
    }

    /**
     * invoked whenever socket opened.
     */
    protected handleOnOpen(ws: WebSocket, evt: Event) {
        if (this.socket != null && this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {
            this.state = SocketState.Connected;
            cc.log("handleOpened: ", this.constructor.name);
            if (this.pendingMessages.length > 0) {
                for (let i = 0; i < this.pendingMessages.length; i++) {
                    this.send(this.pendingMessages[i]);
                }
                this.pendingMessages = [];
            }
        } else {
            cc.error("Invalid handlOnOpen, the callback is return but the current socket state is invalid.");
        }
    }

    /**
     * invoked whenever an error accured.
     */
    protected handleOnError(ws: WebSocket, evt: CloseEvent) {
        cc.log("handleOnError: ", ws, evt);
        this.state = SocketState.Closed;
        this.closeCode = CloseCode.ServerError;
        this.close();
    }

    /**
     * invoked whenever socket has been closed.
     */
    protected handleOnClose(ws: WebSocket, evt: CloseEvent) {
        cc.log("handleOnClose");
        this.state = SocketState.Closed;
        this.resetSocket(SocketState.Closed);

        //reconnect only if not be kicked or error.
        if (this.closeCode == CloseCode.Normal || this.closeCode == CloseCode.ServerError) {

        }
    }

    /**
     * invoked whenever received a new message from socket.
     */
    private handleOnMessage({data}) {
        var rawBytes = new Int8Array(data);
        var bulkMessages = new PTMessage();
        bulkMessages.writeArrByte(rawBytes, rawBytes.length);

        var count = bulkMessages.readByte();
        for (var i = 0; i < count; i++) {
            var child = new PTMessage()
            var cmd = bulkMessages.readByte()
            var size = bulkMessages.readShort()
            var byte = bulkMessages.readArrByte(size)
            child.setCommand(cmd)
            child.writeArrByte(byte, size)

            //handle message.
            //PTEventManager.fire2(PTEventManager.ON_MESSAGE_RECEIVE, child.cloneMessage());
            this.handleMessage(child.cloneMessage());
        }
    }

    protected handleMessage(msg: PTMessage) {

    }

    protected setState(state: SocketState) {
        this.state = state;
    }

    protected setCloseCode(code: CloseCode) {
        this.closeCode = code;
    }
}
