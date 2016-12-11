"use strict";
var BinaryReader = (function () {
    function BinaryReader(buffer, littleEndian) {
        this.buffer = buffer;
        this.littleEndian = littleEndian;
        this.dataView = new DataView(this.buffer);
        this.currentPos = 0;
        this.littleEndian = (littleEndian == null) || littleEndian;
    }
    BinaryReader.prototype.readUtf8 = function (length) {
        var res = BinaryReader.bufferToString(this.buffer.slice(this.currentPos, this.currentPos + length));
        this.currentPos += length;
        return res;
    };
    BinaryReader.prototype.align = function (count) {
        var skip = count - (this.currentPos % count);
        if (skip > 0 && skip != count) {
            this.currentPos += skip;
        }
    };
    BinaryReader.prototype.readFloat64Array = function (length) {
        var ret = new Float64Array(this.buffer, this.currentPos, length);
        this.currentPos += length * 8;
        return ret;
    };
    BinaryReader.prototype.readFloat64 = function (littleEndian) {
        var ret = this.dataView.getFloat64(this.currentPos, this.getEndian(littleEndian));
        this.currentPos += 8;
        return ret;
    };
    BinaryReader.prototype.readFloat32Array = function (length) {
        var ret = new Float32Array(this.buffer, this.currentPos, length);
        this.currentPos += 4 * length;
        return ret;
    };
    BinaryReader.prototype.readFloat32 = function (littleEndian) {
        var ret = this.dataView.getFloat32(this.currentPos, this.getEndian(littleEndian));
        this.currentPos += 4;
        return ret;
    };
    BinaryReader.prototype.readInt32Array = function (length) {
        var ret = new Int32Array(this.buffer, this.currentPos, length);
        this.currentPos += 4 * length;
        return ret;
    };
    BinaryReader.prototype.readInt64 = function (littleEndian) {
        var ret = this.dataView.getUint32(this.currentPos, this.getEndian(littleEndian))
            + 0x100000000 * this.dataView.getUint32(this.currentPos + 4, this.getEndian(littleEndian));
        this.currentPos += 8;
        return ret;
    };
    BinaryReader.prototype.readInt32 = function (littleEndian) {
        var ret = this.dataView.getInt32(this.currentPos, this.getEndian(littleEndian));
        this.currentPos += 4;
        return ret;
    };
    BinaryReader.prototype.readInt16Array = function (length) {
        var ret = new Int16Array(this.buffer, this.currentPos, length);
        this.currentPos += 2 * length;
        return ret;
    };
    BinaryReader.prototype.readInt16 = function (littleEndian) {
        var ret = this.dataView.getInt16(this.currentPos, this.getEndian(littleEndian));
        this.currentPos += 2;
        return ret;
    };
    BinaryReader.prototype.readInt8Array = function (length) {
        var ret = new Int8Array(this.buffer, this.currentPos, length);
        this.currentPos += length;
        return ret;
    };
    BinaryReader.prototype.readInt8 = function () {
        var ret = this.dataView.getInt8(this.currentPos);
        this.currentPos += 1;
        return ret;
    };
    BinaryReader.prototype.readByte = function () {
        var ret = this.dataView.getInt8(this.currentPos);
        this.currentPos += 1;
        return ret;
    };
    BinaryReader.prototype.getEndian = function (endian) {
        if (endian != null) {
            return endian;
        }
        else {
            return this.littleEndian;
        }
    };
    BinaryReader.bufferToString = function (buffer) {
        var byteArray = new Uint8Array(buffer);
        var strArray = [];
        var str = '', cc = 0, numBytes = 0;
        for (var i = 0, len = byteArray.length; i < len; ++i) {
            var v = byteArray[i];
            if (numBytes > 0) {
                if ((cc & 192) === 192) {
                    cc = (cc << 6) | (v & 63);
                }
                else {
                    throw new Error("this is no tailing-byte");
                }
            }
            else if (v < 128) {
                numBytes = 1;
                cc = v;
            }
            else if (v < 192) {
                throw new Error("invalid byte, this is a tailing-byte");
            }
            else if (v < 224) {
                numBytes = 2;
                cc = v & 31;
            }
            else if (v < 240) {
                numBytes = 3;
                cc = v & 15;
            }
            else {
                throw new Error("invalid encoding, value out of range");
            }
            if (--numBytes === 0) {
                strArray.push(String.fromCharCode(cc));
            }
        }
        if (numBytes) {
            throw new Error("the bytes don't sum up");
        }
        return strArray.join("");
    };
    return BinaryReader;
}());
exports.BinaryReader = BinaryReader;
