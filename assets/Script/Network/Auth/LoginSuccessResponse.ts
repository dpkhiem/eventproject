import SocketCommandManager from "../SocketCommandManager";
import ResponseManager, {NetParamType} from "../ResponseManager";

export default class LoginSuccessResponse extends ResponseManager {
    public command(): number {
        return SocketCommandManager.LOGIN;
    }

    protected parameterTypes(): NetParamType[] {
        return [
            NetParamType.Bool,
            NetParamType.StringUTF,
            NetParamType.StringUTF,
            NetParamType.StringUTF,
            NetParamType.StringUTF,
            NetParamType.Byte,

        ];
    }

    protected setFields(fields: any[]) {
        this.isSuccess = fields[0];
        this.eventId = fields[1];
        this.playerId = fields[2];
        this.playerName = fields[3];
        this.playerPhone = fields[4];
        this.changeDisplayNumber = fields[5];
    }

    public isSuccess: boolean;
    public eventId: string;
    public playerId: string;
    public playerName: string;
    public playerPhone: string;
    public changeDisplayNumber: number;

}
