import {workspace, window, Disposable, Range, TextDocument, Diagnostic, DiagnosticSeverity, DiagnosticCollection, languages} from "vscode";
import * as child from 'child_process';
import BaseLinter from "./BaseLinter";
import { Logger, Log_Severity } from "../Logger";

var isWindows = process.platform === "win32";

export default class IcarusLinter extends BaseLinter {
    private iverilogArgs: string;
    private runAtFileLocation: boolean;

    constructor(logger: Logger) {
        super("iverilog", logger);
        workspace.onDidChangeConfiguration(() => {
            this.getConfig();
        })
        this.getConfig();
    }

    private getConfig() {
        this.iverilogArgs = <string>workspace.getConfiguration().get('verilog.linting.iverilog.arguments');
        this.runAtFileLocation = <boolean>workspace.getConfiguration().get('verilog.linting.iverilog.runAtFileLocation')
    }

    protected lint(doc: TextDocument) {
        this.logger.log('iverilog lint requested');
        let docUri: string = doc.uri.fsPath     //path of current doc
        let lastIndex:number = (isWindows == true)? docUri.lastIndexOf("\\") : docUri.lastIndexOf("/");
        let docFolder = docUri.substr(0, lastIndex);    //folder of current doc
        let runLocation: string = (this.runAtFileLocation == true)? docFolder : workspace.rootPath;     //choose correct location to run
        let svArgs : string = (doc.languageId == "systemverilog")? "-g2012" : "";                       //SystemVerilog args
        let command: string = 'iverilog ' + svArgs + ' -t null ' + this.iverilogArgs + ' \"' + doc.fileName +'\"';     //command to execute
        this.logger.log(command, Log_Severity.Command);
        
        var foo: child.ChildProcess = child.exec(command,{cwd:runLocation},(error:Error, stdout:string, stderr:string) => {
            let diagnostics: Diagnostic[] = [];
            let lines = stderr.split(/\r?\n/g);
            // Parse output lines
            lines.forEach((line, i) => {
                if(line.startsWith(doc.fileName)){
                    line = line.replace(doc.fileName, '');
                    let terms = line.split(':');
                    console.log(terms[1] + ' ' + terms[2]);
                    let lineNum = parseInt(terms[1].trim()) - 1;
                    if(terms.length == 3)
                    diagnostics.push({
                        severity: DiagnosticSeverity.Error,
                        range:new Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                        message: terms[2].trim(),
                        code: 'iverilog',
                            source: 'iverilog'
                        });
                    else if(terms.length >= 4){
                        let sev: DiagnosticSeverity;
                        if(terms[2].trim() == 'error')
                        sev = DiagnosticSeverity.Error;
                        else if(terms[2].trim() == 'warning')
                        sev = DiagnosticSeverity.Warning
                        else
                        sev = DiagnosticSeverity.Information
                        diagnostics.push({
                            severity: sev,
                            range:new Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                            message: terms[3].trim(),
                            code: 'iverilog',
                            source: 'iverilog'
                        });
                    }
                }
            })
            this.logger.log(diagnostics.length + ' errors/warnings returned');
            this.diagnostic_collection.set(doc.uri, diagnostics)
        })
    }
}
