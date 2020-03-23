/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { RuleContext } from "../RuleContext";
import { ParseTree } from "./ParseTree";
import { ParseTreeVisitor } from "./ParseTreeVisitor";
import { Parser } from "../Parser";
import { Interval } from "../misc/Interval";
export declare abstract class RuleNode implements ParseTree {
    readonly abstract ruleContext: RuleContext;
    readonly abstract parent: RuleNode | undefined;
    abstract setParent(parent: RuleContext): void;
    abstract getChild(i: number): ParseTree;
    abstract accept<T>(visitor: ParseTreeVisitor<T>): T;
    readonly abstract text: string;
    abstract toStringTree(parser?: Parser | undefined): string;
    readonly abstract sourceInterval: Interval;
    readonly abstract payload: any;
    readonly abstract childCount: number;
}
