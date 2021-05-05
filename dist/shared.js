"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImpStr = exports.collectImp = exports.stylePathHandler = exports.codeIncludesLibraryName = void 0;
const param_case_1 = require("param-case");
const parser_1 = require("@babel/parser");
function codeIncludesLibraryName(code, libList) {
    return libList.some(({ libName }) => {
        return new RegExp(`('${libName}')|("${libName}")`).test(code);
    });
}
exports.codeIncludesLibraryName = codeIncludesLibraryName;
;
function stylePathHandler(stylePath) {
    if (typeof stylePath === 'string' && stylePath) {
        return `import '${stylePath}'\n`;
    }
    let str = '';
    if (Array.isArray(stylePath)) {
        stylePath.forEach(item => {
            str += `import '${item}'\n`;
        });
    }
    return str;
}
exports.stylePathHandler = stylePathHandler;
;
function recordImpName(recordObj, libName) {
    return (item) => {
        let name = item.imported.name;
        if (!name)
            return;
        if (recordObj[libName]) {
            recordObj[libName].push(name);
        }
        else {
            recordObj[libName] = [name];
        }
    };
}
const collectImp = (code, libList) => {
    let ast = parser_1.parse(code, { sourceType: 'module' });
    let impExps = ast.program.body.filter(v => v.type === 'ImportDeclaration');
    let importMaps = {};
    impExps.forEach((node) => {
        let libName = node.source.value;
        let matchLib = libList.find(v => v.libName === libName);
        if (!matchLib)
            return;
        node.specifiers.forEach(recordImpName(importMaps, libName));
    });
    return importMaps;
};
exports.collectImp = collectImp;
const generateImpStr = (libList, importMaps) => {
    let importStr = '';
    libList.forEach(({ libName, style, camel2DashComponentName = true }) => {
        if (!importMaps[libName])
            return;
        importMaps[libName].forEach(name => {
            if (camel2DashComponentName) {
                name = param_case_1.paramCase(name);
            }
            let stylePath = style(name) || '';
            importStr += stylePathHandler(stylePath);
        });
    });
    return importStr;
};
exports.generateImpStr = generateImpStr;
