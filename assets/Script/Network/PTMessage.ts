// const encoding = require('encoding');
// import encoding from 'text-encoding'

import { TextDecoder } from "./UTF8Encoding/utf8-encoding/utf8-encoding";
export class PTMessage {
    // extends: cc.Node,
    arrByte = [];
    length = 0;
    posRead = 0;
    command = -1;
    sub = -1;

    public cloneMessage(): PTMessage {
        var msg = new PTMessage();
        msg.setCommand(this.getCommand())
        msg.writeArrByte(this.arrByte, this.arrByte.length);
        return msg;
    }

    public compareOther(other: PTMessage): boolean {
        if (!other) {
            return false
        }

        if (other.command != this.command ||
            !other.arrByte || !this.arrByte ||
            other.arrByte.length != this.arrByte.length) {
            return false;
        }

        for (let i = 0; i < this.arrByte.length; i++) {
            if (this.arrByte[i] != other.arrByte[i]) {
                return false;
            }
        }

        return true;
    }

    public getCommand() {
        return this.command;
    }

    public setCommand(value) {
        this.command = value;
    }

    public getSubCommand() {
        return this.sub;
    }

    public setSubCommand(sub) {
        this.sub = sub;
    }

    public getArrByte() {
        return this.arrByte;
    }

    addArrByte(arr) {
        for (var i = 0; i < arr.length; i++) {
            this.arrByte.push(arr[i]);
        }
    }

    public writeShort(long) {
        var byteArray = [0, 0];
        for (var index = 0; index < byteArray.length; index++) {
            var byte = long & 0xff;
            byteArray[1 - index] = byte;
            long = (long - byte) / 256;
        }
        this.addArrByte(byteArray);

    }

    // write float 2 dau thap phan va nho hon 128, VD 0.98 3,11, 99.88
    public writeFloat2De(float: number) {
        let nguyen = Math.floor(float);
        let thapphan = Math.floor((float - nguyen) * 100);
        this.writeByte(nguyen);
        this.writeByte(thapphan);
    }

    public writeInt(long) {
        var byteArray = [0, 0];
        for (var index = 0; index < byteArray.length; index++) {
            var byte = long & 0xff;
            byteArray[3 - index] = byte;
            long = (long - byte) / 256;
        }
        this.addArrByte(byteArray);
    }

    public writeLong(long) {
        var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for (var index = 0; index < byteArray.length; index++) {
            var byte = long & 0xff;
            byteArray[7 - index] = byte;
            long = (long - byte) / 256;
        }
        this.addArrByte(byteArray);
    }

    public writeStringUTF(str) {
        this.writeShort(this.lengthInUtf8Bytes(str));
        var utf8 = unescape(encodeURIComponent(str));

        var arr = [];
        for (var i = 0; i < utf8.length; i++) {
            arr.push(utf8.charCodeAt(i));
        }
        this.addArrByte(arr);
    }

    public writeBoolFirst(bool) {
        var byte = [];
        byte[0] = 0;
        if (bool) {
            byte[0] = 1;
        }
        this.arrByte.unshift(byte);

    }

    public writeBool(bool) {
        var byte = [];
        byte[0] = 0;
        if (bool) {
            byte[0] = 1;
        }
        this.addArrByte(byte);
    }

    public writeByte(byte) {
        if (this.arrByte.length == 0) {
            this.setCommand(byte);
        }
        this.arrByte.push(byte);
    }

    public writeArrByte(arrByte, length) {
        for (var i = 0; i < length; i++) {
            this.arrByte.push(arrByte[i]);
        }
    }

    public writeBytes(arrByte) {
        this.writeShort(arrByte.length);
        for (var i = 0; i < arrByte.length; i++) {
            this.arrByte.push(arrByte[i]);
        }
    }

    public writeBytesLengthByte(arrByte) {
        this.writeByte(arrByte.length);
        for (var i = 0; i < arrByte.length; i++) {
            this.arrByte.push(arrByte[i]);
        }
    }

    public readByte() {
        var c = this.getChar(this.posRead);
        this.posRead++;
        if (c >= 128)
            return c - 256
        return c;
    }

    getChar(pos) {
        if (pos < this.arrByte.length) {
            return this.arrByte[pos];
        }
    }

    size() {
        return this.arrByte.length;
    }

    available() {
        return this.arrByte.length - this.posRead;
    }

    public readShort() {
        var size = 2;
        var value = 0;
        var byte = [];
        if (this.posRead + size <= this.arrByte.length) {
            var byte = [];
            for (var i = 0; i < size; i++) {
                // value = (value * 256) + this.arrByte[this.posRead + i];
                byte[i] = this.arrByte[this.posRead + i];
            }
            value = ((byte[0] & 0xFF) << 8) + (byte[1] & 0xFF);
            this.posRead = this.posRead + size;
        } else {
            throw 'Message EOF readShort';
        }
        if (value >= 32768)
            return value - 65536;
        return value;
    }

    public readInt() {
        var size = 4;
        var value = 0;
        var byte = [];
        if (this.posRead + size <= this.arrByte.length) {
            for (var i = 0; i < size; i++) {
                byte[i] = this.arrByte[this.posRead + i];
            }
            value = (byte[0] << 24) + ((byte[1] & 0xFF) << 16) + ((byte[2] & 0xFF) << 8)
                + (byte[3] & 0xFF);
            this.posRead = this.posRead + size;
        } else {
            throw 'Message EOF readInt';
        }
        return value;
    }

    // read float 2 dau thap phan va nho hon 128, VD 0.98 3,11, 99.88
    public readFloat2De() {
        let nguyen = this.readByte();
        let thapphan = this.readByte();
        return nguyen + thapphan / 100;
    }

    shiftLeftBinary(binary, offset) {
        for (var i = 0; i < offset; i++) {
            binary = binary + '0'
        }
        return binary;
    }

    public readLong() {
        var size = 8;
        var value = 0;
        var byte = [];
        if (this.posRead + size <= this.arrByte.length) {
            for (var i = 0; i < size; i++) {
                byte[i] = this.arrByte[this.posRead + i];
            }
            for (var i = 0; i < size; i++) {
                var bit = byte[i];
                if (i > 0)
                    bit = (byte[i] & 0xff);
                // var bitToString = bit.toString(2);
                var offset = 8 * (size - i - 1);
                var binary = this.shiftLeftBinary(bit.toString(2), offset);
                value = value + parseInt(binary, 2);
            }
            this.posRead = this.posRead + size;
        } else {
            var remainByteCount = this.arrByte.length - this.posRead;
            throw 'Message EOF readLong. Remain byte count: ' + remainByteCount;
        }
        return value;
    }

    public readBool() {
        if (this.posRead + 1 <= this.arrByte.length) {
            var byte = this.arrByte[this.posRead];
            this.posRead = this.posRead + 1;
            if (byte == 0) {
                return false;
            } else {
                return true;
            }
        } else {
            throw 'Message EOF readBool';
        }
        return false;
    }

    public readBoolean() {
        return this.readBool();
    }

    public readFloat() {
        var str = this.readStringUTF();
        return parseFloat(str);
    }

    public readStringUTF() {
        var size = this.readShort();
        var string;
        var byte = [];

        if (this.posRead + size <= this.arrByte.length) {
            for (var i = 0; i < size; i++) {
                byte.push(this.arrByte[this.posRead + i]);
            }
            this.posRead = this.posRead + size;
            var arr = new Uint8Array(byte);
            // string = new encoding.TextDecoder("utf-8").decode(arr);
            string = new TextDecoder("utf-8").decode(arr);
        } else {
            throw 'Message EOF readStringUTF';
        }
        return string;
    }


    decode_utf8(s) {
        return decodeURIComponent(escape(s));
    }

    longToByteArray(/*long*/long) {
        // we want to represent the input as a 8-bytes array
        var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

        for (var index = 0; index < byteArray.length; index++) {
            var byte = long & 0xff;
            byteArray[index] = byte;
            long = (long - byte) / 256;
        }

        return byteArray;
    }

    public readBytes() {
        var byte = [];
        var length = this.readByte();
        if (this.posRead + length <= this.arrByte.length) {
            for (var i = 0; i < length; i++) {
                byte[i] = this.arrByte[this.posRead + i]
            }
            this.posRead = this.posRead + length;
        } else {
            throw 'Message EOF readBytes';
        }
        return byte;
    }


    public readArrByte(length) {
        var byte = [];
        if (this.posRead + length <= this.arrByte.length) {
            for (var i = 0; i < length; i++) {
                byte[i] = this.arrByte[this.posRead + i]
            }
            this.posRead = this.posRead + length;
        } else {
            throw 'Message EOF readArrByte';
        }
        return byte;
    }

    byteArrayToLong(/*byte[]*/byteArray) {
        var value = 0;
        for (var i = 0; i < byteArray.length; i++) {
            value = (value * 256) + byteArray[i];
        }

        return value;
    }

    lengthInUtf8Bytes(str) {
        // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
        var m = encodeURIComponent(str).match(/%[89ABab]/g);
        return str.length + (m ? m.length : 0);
    }

}
