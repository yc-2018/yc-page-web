import React, {useState} from 'react';
import Search from './Search';
import Bookmarks from './Bookmarks';
import {FloatButton} from "antd";
import {PictureTwoTone} from "@ant-design/icons";


export default function Home() {
    const [count, setCount] = useState(0);

    let backgroundImages = [
        'https://pic.netbian.com/uploads/allimg/231111/010350-16996358307f29.jpg',       //靓女
        'https://pic.netbian.com/uploads/allimg/231117/235008-170023620888b9.jpg',     //龙年贺图
        'https://pic.netbian.com/uploads/allimg/220705/154125-1657006885e9be.jpg',     //阳光树林森林自然风景
        'https://pic.netbian.com/uploads/allimg/231010/172529-1696929929436f.jpg',     //美丽的棕榈日落海边风景
    ]

    return (
        <div className="App" style={{
            height: '100vh',
            backgroundImage: `linear-gradient( rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.4)),url(${[backgroundImages[count ?? 0]]})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
        }}>
            {/* 书签 */}
            <Bookmarks/>

            {/* antd居中输入框 */}
            <div className="ant-input-group">
                <div className="ant-input-group-addon">
                    <i className="anticon anticon-user"></i>
                </div>

                {/*搜索框*/}
                <Search/>

                {/*换壁纸*/}
                <FloatButton
                    onClick={() => setCount(count => (count + 1) % backgroundImages.length)}
                    icon={<PictureTwoTone/>}
                />

            </div>
        </div>
    );
}

