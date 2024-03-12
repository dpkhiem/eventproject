import ResponseManager, {NetParamType} from "../ResponseManager";
import SocketCommandManager from "../SocketCommandManager";


export default class LoginFailedResponse extends ResponseManager {
    public command(): number { return SocketCommandManager.LOGIN; }
    protected parameterTypes(): NetParamType[] {
        return [
            NetParamType.Bool,
            NetParamType.StringUTF,

        ];
    }
    protected setFields(fields: any[]) {
        this.isSuccess = fields[0];
        this.message = fields[1];

    }

    public isSuccess: boolean;
    public message: string;

}
