import {PTMessage} from "./PTMessage";


export enum NetParamType {
    Bool,
    Byte,
    Int,
    Long,
    Short,
    StringUTF,
    Float2De,
    Float,
}

export default abstract class ResponseManager {
    public abstract command(): number;

    protected abstract parameterTypes(): Array<NetParamType>;

    protected abstract setFields(fields: Array<any>);

    private sourceMess: PTMessage = null;

    constructor(message: PTMessage) {
        this.sourceMess = new PTMessage();
        this.sourceMess.setCommand(message.getCommand())
        this.sourceMess.writeArrByte(message.arrByte, message.arrByte.length);
        this.deserialize();
    }

    private deserialize() {
        const c = this.sourceMess.getCommand();
        if (c != this.command()) {
            throw "NetResponse: Command does not match.";
        }

        const netParams = this.parameterTypes();
        if (!netParams || netParams.length == 0) {
            this.setFields([]);
            return;
        }

        const fields: Array<any> = [];
        for (let i = 0; i < netParams.length; i++) {
            let fieldVal: any;
            try {
                switch (netParams[i]) {
                    case NetParamType.Bool:
                        fieldVal = this.sourceMess.readBool();
                        break;

                    case NetParamType.Byte:
                        fieldVal = this.sourceMess.readByte();
                        break;

                    case NetParamType.Int:
                        fieldVal = this.sourceMess.readInt();
                        break;

                    case NetParamType.Long:
                        fieldVal = this.sourceMess.readLong();
                        break;

                    case NetParamType.Short:
                        fieldVal = this.sourceMess.readShort();
                        break;

                    case NetParamType.StringUTF:
                        fieldVal = this.sourceMess.readStringUTF();
                        break;

                    case NetParamType.Float2De:
                        fieldVal = this.sourceMess.readFloat2De();
                        break;

                    case NetParamType.Float:
                        fieldVal = this.sourceMess.readFloat();
                        break;
                }
            } catch (e) {
                cc.error(e);
            } finally {
                fields.push(fieldVal);
            }
        }

        this.setFields(fields);
    }
}
