import React, { useState/* ,useEffect */ } from 'react';
import Search from './Search';
import Bookmarks from './Bookmarks';
import { FloatButton, Drawer } from "antd";
import { PictureTwoTone, SnippetsTwoTone} from "@ant-design/icons";
import { observer } from 'mobx-react-lite'
import showOrNot from '../../store/ShowOrNot';
import "./Home.css"
// import axios from 'axios';


function Home() {
    const [count, setCount] = useState(0);
    let backgroundImages = [
        'https://pic.netbian.com/uploads/allimg/231111/010350-16996358307f29.jpg',       //靓女
        'https://pic.netbian.com/uploads/allimg/231117/235008-170023620888b9.jpg',     //龙年贺图
        'https://pic.netbian.com/uploads/allimg/220705/154125-1657006885e9be.jpg',     //阳光树林森林自然风景
        'https://pic.netbian.com/uploads/allimg/231010/172529-1696929929436f.jpg',     //美丽的棕榈日落海边风景
        'https://pic.netbian.com/uploads/allimg/231031/005647-16986850072083.jpg',      //报纸墙 动漫美女
        'https://pic.netbian.com/uploads/allimg/231117/172835-1700213315e436.jpg',      //发财
        'https://pic.netbian.com/uploads/allimg/231113/235950-169989119080b4.jpg',      //房间
        'https://pic.netbian.com/uploads/allimg/230605/235004-1685980204f133.jpg',      //懒洋洋
        'https://pic.netbian.com/uploads/allimg/230714/004250-1689266570104f.jpg',      //机甲女
        'https://pic.netbian.com/uploads/allimg/231109/003328-16994612082953.jpg',      //朵莉亚
        'https://pic.netbian.com/uploads/allimg/231030/005320-1698598400dca8.jpg',      //西施
        'https://pic.netbian.com/uploads/allimg/231030/003859-1698597539d7ef.jpg',      //黄天
        'https://pic.netbian.com/uploads/allimg/231028/002717-169842403784a6.jpg',      //云
        'https://pic.netbian.com/uploads/allimg/170609/123945-1496983185ad61.jpg',      //云
        'https://pic.netbian.com/uploads/allimg/231011/204728-1697028448b2e1.jpg',      //雪景
        'https://pic.netbian.com/uploads/allimg/230818/115709-16923310295bac.jpg',      //夜晚 雨天 街道 女孩 短发
        'https://pic.netbian.com/uploads/allimg/231003/213220-1696339940d1d4.jpg',      //美女
        'https://pic.netbian.com/uploads/allimg/230730/003405-169064844553de.jpg',      //还是美女
        'https://pic.netbian.com/uploads/allimg/230930/172809-16960660897379.jpg',      //猫
        'https://pic.netbian.com/uploads/allimg/231008/110718-1696734438d0b9.jpg',      //云山
        'https://pic.netbian.com/uploads/allimg/231019/212949-169772218910a3.jpg',      //星空
        'https://pic.netbian.com/uploads/allimg/231019/213128-1697722288f1a3.jpg',      //海景
        'https://pic.netbian.com/uploads/allimg/231019/213128-1697722288f1a3.jpg',      //美女1
    ]


    let backgroundImage = localStorage.getItem('backgroundImages');
    const [images, setImages] = useState('https://pic.netbian.com/uploads/allimg/231111/010350-16996358307f29.jpg');

    const reImagesUrl = () => {
        setCount(Math.floor(Math.random() * backgroundImages.length));
        const imgUrl = backgroundImages[count]
        localStorage.setItem('backgroundImages', imgUrl);
        setImages(imgUrl)
        console.log(imgUrl)
    }


    return (

        <div
            style={{
                height: '100vh',
                backgroundImage: `linear-gradient( rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.4)),url(${backgroundImage || images})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
            }}
        >
            {/* 书签 */}
            <Bookmarks />

            {/* 居中部分 */}
            <div className="App" >
                {/* antd居中输入框 */}
                <div className="ant-input-group">
                    <div className="ant-input-group-addon">
                        <i className="anticon anticon-user"></i>
                    </div>

                    {/*搜索框*/}
                    <Search />

                    {/*显示备忘录*/}
                    <FloatButton
                        onClick={() => showOrNot.setMemoDrawerShow(true)}
                        icon={<SnippetsTwoTone />}
                        tooltip="点击弹出备忘录"
                        style={{opacity: 0.3}}
                    />

                    {/*换壁纸*/}
                    <FloatButton
                        onClick={reImagesUrl}
                        icon={<PictureTwoTone />}
                        tooltip="点击换壁纸"
                        style={{right: 80}}
                    />

                    <Drawer title="备忘录" placement="right" onClose={() => showOrNot.setMemoDrawerShow(false)} open={showOrNot.memoDrawerShow} style={{opacity: 0.8}}>
                        <p>按时睡觉，不按时睡觉，你就是个loser</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
 
                    </Drawer>

                    {/* 侧边半透明的边 移动到上面显示抽屉 */}
                    <div
                        onMouseEnter={() => showOrNot.setMemoDrawerShow(true)}
                        style={{ width: 5, position: 'fixed', right: 0, top: 0, height: '100%', backgroundColor: 'aliceblue', opacity: '15%' }}
                    />


                </div>
            </div>
        </div>
    );
}

export default observer(Home)