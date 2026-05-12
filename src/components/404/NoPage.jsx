import React from 'react';
import { Button, Result } from 'antd';
import {useNavigate} from "react-router-dom";
const NoPage = () => {
const navigate = useNavigate()   // 路由跳转
    return (
        <Result
            status="404"
            title="404"
            subTitle="很抱歉，您访问的页面不存在。"
            extra={<Button type="primary" onClick={() => navigate('/')}>回到主页</Button>}
        />
    )
}

export default NoPage;