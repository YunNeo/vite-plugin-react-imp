# vite-plugin-react-imp
A plugin for vite-react-app to import style by component name automatic.

# Before Use
This library is reference from [vite-plugin-imp](https://github.com/onebay/vite-plugin-imp#readme)

Because vite-react-app has a plugin [react-refresh](https://github.com/vitejs/vite/tree/main/packages/plugin-react-refresh) which will inject some code at runtime (dev model),when work with `vite-plugin-imp` the sourceMap will misalign.

I try to fix it and report issue,but finaly i realize it can be new one.
So I build this library.

# Usage
## install
```
npm i vite-plugin-react-imp -D
```
or
```
yarn add vite-plugin-react-imp -D
```
## Example
```js
// vite.config.js
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh';
import injectStyle from 'vite-plugin-react-imp'

export default defineConfig({
  plugins: [
    reactRefresh(), 
    injectStyle({
      libList: [
        {
          libName: 'antd',
          style(componentName) {
            return `antd/es/${componentName}/style/css.js`
          }
        }
      ]
    })
  ]
})
```
The parameter is ImpConfig
``` ts
interface ImpConfig {
  libList: libItem[]
}

interface LibItem {
 /**
  * library name
  */
 libName: string
 /**
  * component style file path
  */
 style: (name: string) => string | string[] | boolean
 /**
  * whether convert component name from camel to dash
  */
 camel2DashComponentName?: boolean

}

```

