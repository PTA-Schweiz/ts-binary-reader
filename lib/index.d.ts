export declare class BinaryReader {
    buffer: ArrayBuffer;
    private littleEndian;
    dataView: DataView;
    currentPos: number;
    constructor(buffer: ArrayBuffer, littleEndian?: boolean);
    readUtf8(length: any): string;
    align(count: number): void;
    readFloat64Array(length: any): Float64Array;
    readFloat64(littleEndian?: boolean): number;
    readFloat32Array(length: any): Float32Array;
    readFloat32(littleEndian?: boolean): number;
    readInt32Array(length: any): Int32Array;
    readInt64(littleEndian?: boolean): number;
    readInt32(littleEndian?: boolean): number;
    readInt16Array(length: any): Int16Array;
    readInt16(littleEndian?: boolean): number;
    readInt8Array(length: number): Int8Array;
    readInt8(): number;
    readByte(): number;
    private getEndian(endian);
    static bufferToString(buffer: ArrayBuffer): string;
}
