"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Defines the information needed to create a `Diagnostic` object. */
class DiagnosticData {
}
exports.DiagnosticData = DiagnosticData;
/**
    Checks if `diagnosticData`'s fields are not `undefined`

    @param diagnosticData the DiagnosticData
    @return true if at least one field is `undefined`
*/
function isDiagnosticDataUndefined(diagnosticData) {
    if (diagnosticData.line === undefined || diagnosticData.problem === undefined ||
        diagnosticData.diagnosticSeverity === undefined || diagnosticData.filePath === undefined) {
        return true;
    }
    return false;
}
exports.isDiagnosticDataUndefined = isDiagnosticDataUndefined;
//# sourceMappingURL=DiagnosticData.js.map