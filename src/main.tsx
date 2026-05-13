import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import {ConfigProvider, type ConfigProviderProps} from 'antd';
import App from './App'
import {BrowserRouter} from 'react-router-dom';
import './index.css'

const antdV6CompatConfig: Pick<ConfigProviderProps, 'theme' | 'modal' | 'drawer' | 'tag'> = { // antd v6 兼容配置
  theme: {components: {Message: {zIndexPopup: 9999999}}},
  modal: {mask: {blur: false}},
  drawer: {mask: {blur: false}},
  tag: {styles: {root: {marginInlineEnd: 8}}},
}

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN} {...antdV6CompatConfig}>
    {/*<BrowserRouter future={{v7_relativeSplatPath: true, v7_startTransition: true}}>*/}
    <BrowserRouter>
      <StrictMode>
        <App/>
      </StrictMode>
    </BrowserRouter>
  </ConfigProvider>
)
