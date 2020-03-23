/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
/**
 * Wrapper for `Uint8Array` / `Uint16Array` / `Int32Array`.
 */
export declare class CodePointBuffer {
    private readonly buffer;
    private _position;
    private _size;
    constructor(buffer: Uint8Array | Uint16Array | Int32Array, size: number);
    static withArray(buffer: Uint8Array | Uint16Array | Int32Array): CodePointBuffer;
    position: number;
    readonly remaining: number;
    get(offset: number): number;
    array(): Uint8Array | Uint16Array | Int32Array;
    static builder(initialBufferSize: number): CodePointBuffer.Builder;
}
export declare namespace CodePointBuffer {
    class Builder {
        private type;
        private buffer;
        private prevHighSurrogate;
        private position;
        constructor(initialBufferSize: number);
        build(): CodePointBuffer;
        private static roundUpToNextPowerOfTwo(i);
        ensureRemaining(remainingNeeded: number): void;
        append(utf16In: Uint16Array): void;
        private appendArray(utf16In);
        private appendArrayByte(utf16In);
        private appendArrayChar(utf16In);
        private appendArrayInt(utf16In);
        private byteToCharBuffer(toAppend);
        private byteToIntBuffer(toAppend);
        private charToIntBuffer(toAppend);
    }
}
