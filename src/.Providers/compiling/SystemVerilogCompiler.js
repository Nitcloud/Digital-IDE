"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const VerilatorCompiler_1 = require("./VerilatorCompiler");
const VCSCompiler_1 = require("./VCSCompiler");
/* defines supported simulators/compilers */
var compilerType;
(function (compilerType) {
    compilerType[compilerType["Verilator"] = 1] = "Verilator";
    compilerType[compilerType["VCS"] = 2] = "VCS";
})(compilerType = exports.compilerType || (exports.compilerType = {}));
;
/*
    SystemVerilog Compiler handles functionality for compiling documents using the supported simulators.
    Used by the LSP's `connection` to handle getting `Diagnostics` for `documents`
*/
class SystemVerilogCompiler {
    constructor(connection, documents, workspaceRootPath, configurations, compilerConfigurationsKeys) {
        this.connection = connection;
        this.documents = documents;
        this.workspaceRootPath = workspaceRootPath;
        this.configurations = configurations;
        this.compilerConfigurationsKeys = compilerConfigurationsKeys;
    }
    /**
        Compiles the given `document` using the compiler/simulator specified by `type`.

        @returns a `Promise` of a map of entries mapping each uri to a `Diagnostic` array
    */
    validateTextDocument(document, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type == compilerType.Verilator) {
                this.compiler = new VerilatorCompiler_1.VerilatorCompiler(this.connection, this.documents, this.workspaceRootPath, this.configurations, this.compilerConfigurationsKeys);
            }
            else if (type == compilerType.VCS) {
                this.compiler = new VCSCompiler_1.VCSCompiler(this.connection, this.documents, this.workspaceRootPath, this.configurations, this.compilerConfigurationsKeys);
            }
            else {
                this.connection.console.log("SystemVerilog: '" + type + "' is an invalid compiler type.");
                return;
            }
            return this.compiler.getTextDocumentDiagnostics(document);
        });
    }
}
exports.SystemVerilogCompiler = SystemVerilogCompiler;
//# sourceMappingURL=SystemVerilogCompiler.js.map