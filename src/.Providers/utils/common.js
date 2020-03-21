"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uriJs = require("uri-js");
/**
    Get path from a given `uri`

    @param uri the uri
    @param rootPath the root path
    @return the path
*/
function getPathFromUri(uri, rootPath) {
    if (!uri || !rootPath) {
        return "";
    }
    uri = decodeURIComponent(uri); //convert hex chars to ASCII
    let parsedUri = uriJs.parse(uri);
    if (!parsedUri.path) {
        return "";
    }
    rootPath = rootPath.replace(/\\/g, '/');
    let regex = new RegExp("/?" + rootPath + "(.*)");
    let matches;
    if ((matches = regex.exec(parsedUri.path)) && matches.length > 1) {
        return rootPath + matches[1];
    }
    return "";
}
exports.getPathFromUri = getPathFromUri;
//# sourceMappingURL=common.js.map