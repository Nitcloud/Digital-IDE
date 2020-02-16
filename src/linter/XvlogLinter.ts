import {Disposable, Range, TextDocument, Diagnostic, DiagnosticSeverity, DiagnosticCollection} from "vscode";
import {ChildProcess, exec} from 'child_process';
import BaseLinter from "./BaseLinter";
import { Logger, Log_Severity } from "../Logger";


export default class XvlogLinter extends BaseLinter {
    private iverilogArgs: string;

    constructor(logger: Logger) {
        super("xvlog", logger);
    }

    protected lint(doc: TextDocument) {
        this.logger.log('xvlog lint requested');
        let svArgs : string = (doc.languageId == "systemverilog") ? "-sv" : "";         //Systemverilog args
        let command = "xvlog " + svArgs + " -nolog " + doc.fileName;
        this.logger.log(command, Log_Severity.Command);

        let process: ChildProcess = exec(command, (error: Error, stdout: string, stderr: string) => {
            let diagnostics: Diagnostic[] = [];

            let lines = stdout.split(/\r?\n/g);
            lines.forEach((line) => {

                let tokens = line.split(/:?\s*(?:\[|\])\s*/).filter(Boolean);
                if (tokens.length < 4
                    || tokens[0] != "ERROR"
                    || !tokens[1].startsWith("VRFC")) {
                    return;
                }

                // Get filename and line number
                let [filename, lineno_str] = tokens[3].split(/:(\d+)/);
                let lineno = parseInt(lineno_str) - 1;

                // if (filename != doc.fileName) // Check that filename matches
                //     return;

                let diagnostic: Diagnostic = {
                    severity: DiagnosticSeverity.Error,
                    code: tokens[1],
                    message: "[" + tokens[1] + "] " + tokens[2],
                    range: new Range(lineno, 0, lineno, Number.MAX_VALUE),
                    source: "xvlog",
                }

                diagnostics.push(diagnostic);
            })
            this.logger.log(diagnostics.length + ' errors/warnings returned');
            this.diagnostic_collection.set(doc.uri, diagnostics)
        })
    }
}
