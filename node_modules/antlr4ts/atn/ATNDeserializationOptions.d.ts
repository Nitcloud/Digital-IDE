/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
/**
 *
 * @author Sam Harwell
 */
export declare class ATNDeserializationOptions {
    private static _defaultOptions?;
    private readOnly;
    private verifyATN;
    private generateRuleBypassTransitions;
    private optimize;
    constructor(options?: ATNDeserializationOptions);
    static readonly defaultOptions: ATNDeserializationOptions;
    readonly isReadOnly: boolean;
    makeReadOnly(): void;
    isVerifyATN: boolean;
    isGenerateRuleBypassTransitions: boolean;
    isOptimize: boolean;
    protected throwIfReadOnly(): void;
}
