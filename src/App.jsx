import React, { useState, useEffect } from 'react';
import './App.css';
import Search from './pages/Search';


export default function App() {
    let backgroundImage = 'http://pic.netbian.com/uploads/allimg/231111/010350-16996358307f29.jpg'
    const {backgroundUrl,setBackgroundUrl} = useState(backgroundImage);
    
    return (
        <div className="App" style={{
            height: '100vh',
            backgroundImage: `linear-gradient( rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.829)),url(${backgroundImage})`,
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

