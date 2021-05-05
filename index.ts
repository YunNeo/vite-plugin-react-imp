import MagicString from 'magic-string';
import { Plugin } from 'vite'
import { codeIncludesLibraryName, collectImp, generateImpStr, ImpConfig } from './shared';


export default function (config: ImpConfig): Plugin {
    return {
        name: 'vite-plugin-react-imp',
        transform(code, id) {
            const isFit = !/(node_modules)/.test(id) && codeIncludesLibraryName(code, config.libList);
            if (!isFit) return { code, map: null };

            const importMaps = collectImp(code, config.libList);

            const importStr = generateImpStr(config.libList, importMaps);

            const magicString = new MagicString(code);
            
            magicString.prepend(importStr);

            return {
                code: magicString.toString(),
                map: magicString.generateMap({ hires: true, source: id }),
            };
        },
    };
}
