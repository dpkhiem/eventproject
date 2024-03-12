import {NetParamType} from "./ResponseManager";
import {PTMessage} from "./PTMessage";

export default abstract class NetRequest {
    public abstract command(): number;
    protected abstract parameterTypes(): Array<NetParamType>;
    protected abstract getFields(): Array<any>;

    public serialize(): PTMessage {
        const fields = this.getFields();
        var mess = new PTMessage();
        mess.writeByte(this.command());

        var netParams = this.parameterTypes();
        if (!netParams || netParams.length == 0)
            return mess;

        if (!fields || fields.length != netParams.length) {
            throw "NetRequest: fields length does not match with params";
        }

        for (let i = 0; i < netParams.length; i++) {
            switch (netParams[i]) {
                case NetParamType.Bool:
                    mess.writeBool(fields[i]);
                    continue;

                case NetParamType.Byte:
                    mess.writeByte(fields[i]);
                    continue;

                case NetParamType.Int:
                    mess.writeInt(fields[i]);
                    continue;

                case NetParamType.Long:
                    mess.writeLong(fields[i]);
                    continue;

                case NetParamType.Short:
                    mess.writeShort(fields[i]);
                    continue;

                case NetParamType.StringUTF:
                    mess.writeStringUTF(fields[i]);
                    continue;

                case NetParamType.Float2De:
                    mess.writeFloat2De(fields[i]);
                    continue;

                case NetParamType.Float:
                    throw "NetRequest: writer does not support Float type.";
            }
        }

        return mess;
    }
}
