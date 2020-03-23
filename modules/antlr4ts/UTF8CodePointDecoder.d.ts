/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { CodingErrorAction } from "./CodingErrorAction";
import { Interval } from "./misc/Interval";
/**
 * Decodes UTF-8 bytes directly to Unicode code points, stored in an
 * {@link IntBuffer}.
 *
 * Unlike {@link CharsetDecoder}, this does not use UTF-16 as an
 * intermediate representation, so this optimizes the common case of
 * decoding a UTF-8 file for parsing as Unicode code points.
 */
export declare class UTF8CodePointDecoder {
    protected readonly decodingErrorAction: CodingErrorAction;
    protected decodingTrailBytesNeeded: number;
    protected decodingCurrentCodePoint: number;
    protected validDecodedCodePointRange: Interval;
    /**
     * Constructs a new {@link UTF8CodePointDecoder} with a specified
     * {@link CodingErrorAction} to handle invalid UTF-8 sequences.
     */
    constructor(decodingErrorAction: CodingErrorAction);
    /**
     * Resets the state in this {@link UTF8CodePointDecoder}, preparing it
     * for use with a new input buffer.
     */
    reset(): void;
    /**
     * Decodes as many UTF-8 bytes as possible from {@code utf8BytesIn},
     * writing the result to {@code codePointsOut}.
     *
     * If you have more bytes to decode, set {@code endOfInput} to
     * {@code false} and call this method again once more bytes
     * are available.
     *
     * If there are no more bytes available, make sure to call this
     * setting {@code endOfInput} to {@code true} so that any invalid
     * UTF-8 sequence at the end of the input is handled.
     *
     * If {@code codePointsOut} is not large enough to store the result,
     * a new buffer is allocated and returned. Otherwise, returns
     * {@code codePointsOut}.
     *
     * After returning, the {@link ByteBuffer#position position} of
     * {@code utf8BytesIn} is moved forward to reflect the bytes consumed,
     * and the {@link IntBuffer#position position} of the result
     * is moved forward to reflect the code points written.
     *
     * The {@link IntBuffer#limit limit} of the result is not changed,
     * so if this is the end of the input, you will want to set the
     * limit to the {@link IntBuffer#position position}, then
     * {@link IntBuffer#flip flip} the result to prepare for reading.
     */
    decodeCodePointsFromBuffer(utf8BytesIn: {
        data: Uint8Array;
        position: number;
    }, codePointsOut: {
        data: Int32Array;
        position: number;
    }, endOfInput: boolean): {
        data: Int32Array;
        position: number;
    };
    private decodeLeadingByte(leadingByte);
    private decodeTrailingByte(trailingByte);
    private appendCodePointFromInterval(codePoint, validCodePointRange, codePointsOut);
    private appendCodePoint(codePoint, codePointsOut);
    private handleDecodeError(error, codePointsOut);
}
