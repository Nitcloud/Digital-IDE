/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ErrorNode } from "./ErrorNode";
import { ParserRuleContext } from "../ParserRuleContext";
import { TerminalNode } from "./TerminalNode";
/** This interface describes the minimal core of methods triggered
 *  by {@link ParseTreeWalker}. E.g.,
 *
 * ```
 * ParseTreeWalker walker = new ParseTreeWalker();
 * walker.walk(myParseTreeListener, myParseTree); <-- triggers events in your listener
 * ```
 *
 *  If you want to trigger events in multiple listeners during a single
 *  tree walk, you can use the ParseTreeDispatcher object available at
 *
 * 		https://github.com/antlr/antlr4/issues/841
 */
export interface ParseTreeListener {
    visitTerminal?: (node: TerminalNode) => void;
    visitErrorNode?: (node: ErrorNode) => void;
    enterEveryRule?: (ctx: ParserRuleContext) => void;
    exitEveryRule?: (ctx: ParserRuleContext) => void;
}
