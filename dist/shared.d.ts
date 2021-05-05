declare type AccepetReturnType = string | string[] | boolean;
export interface ImpConfig {
    libList: LibItem[];
}
interface LibItem {
    libName: string;
    style: (componentName: string) => AccepetReturnType;
    /**
     * @default true
     */
    camel2DashComponentName?: boolean;
}
interface ImportMaps {
    [key: string]: string[];
}
export declare function codeIncludesLibraryName(code: string, libList: LibItem[]): boolean;
export declare function stylePathHandler(stylePath: AccepetReturnType): string;
export declare const collectImp: (code: string, libList: LibItem[]) => ImportMaps;
export declare const generateImpStr: (libList: LibItem[], importMaps: ImportMaps) => string;
export {};
