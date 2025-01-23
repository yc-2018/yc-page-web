import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import {ConfigProvider} from "antd";
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN} theme={{components: {Message: {zIndexPopup: 9999999}}}}>
    <BrowserRouter>
      <StrictMode>
        <App/>
      </StrictMode>
    </BrowserRouter>
  </ConfigProvider>
)
