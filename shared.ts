import { paramCase } from 'param-case';
import { parse } from '@babel/parser'
import { ImportDeclaration, Identifier, ImportSpecifier, ImportDefaultSpecifier, ImportNamespaceSpecifier } from '@babel/types';

type AccepetReturnType = string | string[] | boolean
export interface ImpConfig {
    libList: LibItem[]
}
interface LibItem {
    libName: string,

    style: (componentName: string) => AccepetReturnType,

    /**
     * @default true
     */
    camel2DashComponentName?: boolean
}
interface ImportMaps {
    [key: string]: string[]
}

export function codeIncludesLibraryName(code:string, libList:LibItem[]) {
    return libList.some(({ libName }) => {
        return new RegExp(`('${libName}')|("${libName}")`).test(code);
    });
};

export function stylePathHandler(stylePath: AccepetReturnType) {
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
};


function recordImpName(recordObj: ImportMaps, libName: string) {
    return (item: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => {
        let name = ((item as ImportSpecifier).imported as Identifier).name;
        if (!name) return;
        if (recordObj[libName]) {
            recordObj[libName].push(name);
        } else {
            recordObj[libName] = [name];
        }

    };
}

export const collectImp = (code: string, libList: LibItem[]):ImportMaps => {
    let ast = parse(code, { sourceType: 'module' });

    let impExps = ast.program.body.filter(v => v.type === 'ImportDeclaration') as ImportDeclaration[];

    let importMaps = {};
    impExps.forEach((node) => {
        let libName = node.source.value;
        let matchLib = libList.find(v => v.libName === libName);
        if (!matchLib) return;
        node.specifiers.forEach(recordImpName(importMaps, libName));
    });
    return importMaps;
}

export const generateImpStr = (libList: LibItem[], importMaps: ImportMaps) => {
    let importStr = '';
    libList.forEach(({ libName, style, camel2DashComponentName = true }) => {
        if (!importMaps[libName]) return;
        importMaps[libName].forEach(name => {
            if (camel2DashComponentName) {
                name = paramCase(name);
            }
            let stylePath = style(name) || '';
            importStr += stylePathHandler(stylePath);
        });
    });
    return importStr;
}
