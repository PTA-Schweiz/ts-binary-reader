/**
 * Helper to read different types from binary data while keeping track of the position.
 */
export class BinaryReader {

  dataView = new DataView(this.buffer);
  currentPos = 0;

  constructor(public buffer: ArrayBuffer, private littleEndian?: boolean) {
    this.littleEndian = (littleEndian == null) || littleEndian;
  }

  readUtf8(length) {
    let res = BinaryReader.bufferToString(this.buffer.slice(this.currentPos, this.currentPos + length));
    this.currentPos += length;
    return res;
  }

  align(count: number) {
    let skip = count - (this.currentPos % count);
    if(skip > 0 && skip != count) {
      this.currentPos += skip;
    }
  }

  readFloat64Array(length): Float64Array {
    let ret = new Float64Array(this.buffer, this.currentPos, length);
    this.currentPos += length * 8;
    return ret;
  }

  readFloat64(littleEndian?: boolean): number {
    let ret = this.dataView.getFloat64(this.currentPos, this.getEndian(littleEndian));
    this.currentPos += 8;
    return ret;
  }

  readFloat32Array(length): Float32Array {
    let ret = new Float32Array(this.buffer, this.currentPos, length);
    this.currentPos += 4 * length;
    return ret;
  }

  readFloat32(littleEndian?: boolean): number {
    let ret = this.dataView.getFloat32(this.currentPos, this.getEndian(littleEndian));
    this.currentPos += 4;
    return ret;
  }

  readInt32Array(length): Int32Array {
    let ret = new Int32Array(this.buffer, this.currentPos, length);
    this.currentPos += 4 * length;
    return ret;
  }

  readInt64(littleEndian?: boolean): number {
    let ret = this.dataView.getUint32(this.currentPos, this.getEndian(littleEndian))
      + 0x100000000 * this.dataView.getUint32(this.currentPos + 4, this.getEndian(littleEndian));
    this.currentPos += 8;
    return ret;
  }

  readInt32(littleEndian?: boolean): number {
    let ret = this.dataView.getInt32(this.currentPos, this.getEndian(littleEndian));
    this.currentPos += 4;
    return ret;
  }

  readInt16Array(length): Int16Array {
    let ret = new Int16Array(this.buffer, this.currentPos, length);
    this.currentPos += 2 * length;
    return ret;
  }

  readInt16(littleEndian?: boolean) {
    let ret = this.dataView.getInt16(this.currentPos, this.getEndian(littleEndian));
    this.currentPos += 2;
    return ret;
  }

  readInt8Array(length: number): Int8Array {
    let ret = new Int8Array(this.buffer, this.currentPos, length);
    this.currentPos += length;
    return ret;
  }

  readInt8(): number {
    let ret = this.dataView.getInt8(this.currentPos);
    this.currentPos += 1;
    return ret;
  }

  readByte(): number {
    let ret = this.dataView.getInt8(this.currentPos);
    this.currentPos += 1;
    return ret;
  }

  private getEndian(endian: boolean) {
    if(endian != null) {
      return endian;
    } else {
      return this.littleEndian;
    }
  }

  // TODO: May replace this with StringView: https://developer.mozilla.org/en-US/Add-ons/Code_snippets/StringView
  static bufferToString(buffer: ArrayBuffer): string {
    let byteArray = new Uint8Array(buffer);
    let strArray = [];
    let str = '', cc = 0, numBytes = 0;
    for(let i = 0, len = byteArray.length; i < len; ++i) {
      let v = byteArray[i];
      if( numBytes > 0 ) {
        // 2 bit determining that this is a tailing byte + 6 bit of payload
        if ((cc & 192) === 192) {
          // processing tailing-bytes
          cc = (cc << 6) | (v & 63);
        }else{
          throw new Error("this is no tailing-byte");
        }
      } else if(v < 128) {
        // single-byte
        numBytes = 1;
        cc = v;
      } else if(v < 192) {
        // these are tailing-bytes
        throw new Error("invalid byte, this is a tailing-byte")
      } else if(v < 224) {
        // 3 bits of header + 5bits of payload
        numBytes = 2;
        cc = v & 31;
      } else if(v < 240) {
        // 4 bits of header + 4bit of payload
        numBytes = 3;
        cc = v & 15;
      } else {
        // UTF-8 theoretically supports up to 8 bytes containing up to 42bit of payload
        // but JS can only handle 16bit.
        throw new Error("invalid encoding, value out of range")
      }

      if( --numBytes === 0 ) {
        strArray.push(String.fromCharCode(cc));
      }
    }
    if(numBytes) {
      throw new Error("the bytes don't sum up");
    }
    return strArray.join("");
  }

}
