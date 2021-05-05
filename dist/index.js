"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const magic_string_1 = __importDefault(require("magic-string"));
const shared_1 = require("./shared");
function default_1(config) {
    return {
        name: 'vite-plugin-react-imp',
        transform(code, id) {
            const isFit = !/(node_modules)/.test(id) && shared_1.codeIncludesLibraryName(code, config.libList);
            if (!isFit)
                return { code, map: null };
            const importMaps = shared_1.collectImp(code, config.libList);
            const importStr = shared_1.generateImpStr(config.libList, importMaps);
            const magicString = new magic_string_1.default(code);
            magicString.prepend(importStr);
            return {
                code: magicString.toString(),
                map: magicString.generateMap({ hires: true, source: id }),
            };
        },
    };
}
exports.default = default_1;
