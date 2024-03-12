import SocketCommandManager from "../SocketCommandManager"
import {NetParamType} from "../ResponseManager";
import NetRequest from "../NetRequest";


export default class LoginRequest extends NetRequest {
    public command() { return SocketCommandManager.LOGIN; }
    public parameterTypes(): NetParamType[] {
        return [
            NetParamType.StringUTF,
            NetParamType.StringUTF,
            NetParamType.StringUTF,
            NetParamType.StringUTF,
            NetParamType.Byte,
        ];
    }
    protected getFields(): any[] {
        return [
            this.tokenLogin,
            this.versionName,
            this.deviceId,
            this.platformName,
            this.languageType,

        ];
    }

    public eventId: string;
    public userId: string;
    public tokenLogin: string;
    public ip: string;
    public versionName: string;
    public deviceId: string;
    public platformName: string;
    public channelId: number;
    public languageType: number;

}
