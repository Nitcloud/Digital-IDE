/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ParseTree } from "./ParseTree";
import { ParseTreeListener } from "./ParseTreeListener";
import { RuleNode } from "./RuleNode";
export declare class ParseTreeWalker {
    walk<T extends ParseTreeListener>(listener: T, t: ParseTree): void;
    /**
     * The discovery of a rule node, involves sending two events: the generic
     * {@link ParseTreeListener#enterEveryRule} and a
     * {@link RuleContext}-specific event. First we trigger the generic and then
     * the rule specific. We to them in reverse order upon finishing the node.
     */
    protected enterRule(listener: ParseTreeListener, r: RuleNode): void;
    protected exitRule(listener: ParseTreeListener, r: RuleNode): void;
}
export declare namespace ParseTreeWalker {
    const DEFAULT: ParseTreeWalker;
}
