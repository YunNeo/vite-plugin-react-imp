import { stylePathHandler, codeIncludesLibraryName, generateImpStr, collectImp } from '../shared'

describe('Test style function', () => {
    it('stylePath is string', () => {
        const testPath = 'antd/es/button/style/css.js'
        const result = stylePathHandler(testPath)
        const isEqual = result === `import '${testPath}'\n`
        expect(isEqual).toBeTruthy()
    })

    it('stylePath is false', () => {
        const testPath = false
        const result = stylePathHandler(testPath)
        const isEqual = result === ''
        expect(isEqual).toBeTruthy()
    })

    it('stylePath is string[]', () => {
        const testPath = [
            'antd/es/button/style/css.js',
            'antd/es/modal/style/css.js'
        ]
        const result = stylePathHandler(testPath)
        const p0 = `import '${testPath[0]}'\n`
        const p1 = `import '${testPath[1]}'\n`
        expect(result.indexOf(p0) > -1).toBeTruthy()
        expect(result.indexOf(p1) > -1).toBeTruthy()
    })
})

describe('Test collectImp', () => {
    it('', () => {
        const code = `
      import { Button, Modal } from 'antd' 
    `
        const result = collectImp(code,
            [
                {
                    libName: 'antd',
                    style(componentName) {
                        return `antd/es/${componentName}/style/css.js`
                    }
                }
            ]
        )

        expect(result).toEqual({
            antd: ['Button', 'Modal'],
        });

    })
})


describe('Test generateImpStr', () => {
    it('', () => {

        const result = generateImpStr(
            [
                {
                    libName: 'antd',
                    style(componentName) {
                        return `antd/es/${componentName}/style/css.js`
                    }
                }
            ],
            { antd: ['Button', 'Modal'] }
        )
        
        let finalStr = `import 'antd/es/button/style/css.js'\n`+
        `import 'antd/es/modal/style/css.js'\n`

        expect(result).toBe(finalStr)


    })
})
describe('Test codeIncludesLibraryName', () => {
    it('The code include libName', () => {
        const code = `
      import { Button, Modal } from 'antd' 
    `
        const result = codeIncludesLibraryName(code, [
            {
                libName: 'antd',
                style(componentName) {
                    return `antd/es/${componentName}/style/css.js`
                }
            }
        ])
        expect(result).toBeTruthy()
    })

    it('the code do not include libName', () => {
        const code = `
      import { Button, Modal } from 'vant' 
    `
        const result = codeIncludesLibraryName(code, [
            {
                libName: 'antd',
                style(componentName) {
                    return `antd/es/${componentName}/style/css.js`
                }
            }
        ])
        expect(result).toBeFalsy()
    })
})

