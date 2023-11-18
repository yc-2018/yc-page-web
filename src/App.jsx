import React, { useState, useEffect } from 'react';
import './App.css';
import Search from './pages/Search';


export default function App() {
    // let backgroundImage = 'http://pic.netbian.com/uploads/allimg/231111/010350-16996358307f29.jpg'   //靓女
    // let backgroundImage = 'https://pic.netbian.com/uploads/allimg/231117/235008-170023620888b9.jpg'     //龙年贺图
    // let backgroundImage = 'https://pic.netbian.com/uploads/allimg/220705/154125-1657006885e9be.jpg'     //阳光树林森林自然风景
    let backgroundImage = 'https://pic.netbian.com/uploads/allimg/231010/172529-1696929929436f.jpg'     //美丽的棕榈日落海边风景
    const {backgroundUrl,setBackgroundUrl} = useState(backgroundImage);
    
    return (
        <div className="App" style={{
            height: '100vh',
            backgroundImage: `linear-gradient( rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.4)),url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
        }}>
            {/* antd居中输入框 */}
            <div className="ant-input-group">
                <div className="ant-input-group-addon">
                    <i className="anticon anticon-user"></i>
                </div>
                <Search />
            </div>
        </div>
    );
}

