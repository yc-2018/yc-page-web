import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';    // 导入（日历）中文本地化文件
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from'react-router-dom';

import App from './App';
import './common.module.css';
// import reportWebVitals from './reportWebVitals';     // 引入性能测试


dayjs.locale('zh-cn');   // 设置本地化为中文(日历组件)
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <ConfigProvider locale={zhCN} theme={{components: {Message: {zIndexPopup: 9999999}}}}>
        <BrowserRouter>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </BrowserRouter>
    </ConfigProvider>
)



// 如果您想开始在应用程序中测量性能，请传递一个函数
// 以记录结果（例如：reportWebVitals（console.log））
//或者发送到分析端点。了解更多信息：https://bit.ly/CRA-vitals

// reportWebVitals(console.log);    // 想要测试性能时打开
