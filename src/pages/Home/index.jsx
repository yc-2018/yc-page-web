import React, { useState/* ,useEffect */ } from 'react';
import Search from './Search';
import Bookmarks from './Bookmarks';
import { Button, FloatButton, Input, message, Modal, Space } from "antd";
import { PictureTwoTone, SnippetsTwoTone, UserOutlined } from "@ant-design/icons";
import { observer } from 'mobx-react-lite'
import showOrNot from '../../store/ShowOrNot';
import "./Home.css"
import EnglishDrawer from "./EnglishDrawer";
import MemoDrawer from "./MemoDrawer";

import axios from 'axios';


function Home() {
    // const [count, setCount] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    // let backgroundImages = [
    //     'https://pic.netbian.com/uploads/allimg/231111/010350-16996358307f29.jpg',       //靓女
    //     'https://pic.netbian.com/uploads/allimg/231117/235008-170023620888b9.jpg',     //龙年贺图
    //     'https://pic.netbian.com/uploads/allimg/220705/154125-1657006885e9be.jpg',     //阳光树林森林自然风景
    //     'https://pic.netbian.com/uploads/allimg/231010/172529-1696929929436f.jpg',     //美丽的棕榈日落海边风景
    //     'https://pic.netbian.com/uploads/allimg/231031/005647-16986850072083.jpg',      //报纸墙 动漫美女
    //     'https://pic.netbian.com/uploads/allimg/231117/172835-1700213315e436.jpg',      //发财
    //     'https://pic.netbian.com/uploads/allimg/231113/235950-169989119080b4.jpg',      //房间
    //     'https://pic.netbian.com/uploads/allimg/230605/235004-1685980204f133.jpg',      //懒洋洋
    //     'https://pic.netbian.com/uploads/allimg/230714/004250-1689266570104f.jpg',      //机甲女
    //     'https://pic.netbian.com/uploads/allimg/231109/003328-16994612082953.jpg',      //朵莉亚
    //     'https://pic.netbian.com/uploads/allimg/231030/005320-1698598400dca8.jpg',      //西施
    //     'https://pic.netbian.com/uploads/allimg/231030/003859-1698597539d7ef.jpg',      //黄天
    //     'https://pic.netbian.com/uploads/allimg/231028/002717-169842403784a6.jpg',      //云
    //     'https://pic.netbian.com/uploads/allimg/170609/123945-1496983185ad61.jpg',      //云
    //     'https://pic.netbian.com/uploads/allimg/231011/204728-1697028448b2e1.jpg',      //雪景
    //     'https://pic.netbian.com/uploads/allimg/230818/115709-16923310295bac.jpg',      //夜晚 雨天 街道 女孩 短发
    //     'https://pic.netbian.com/uploads/allimg/231003/213220-1696339940d1d4.jpg',      //美女
    //     'https://pic.netbian.com/uploads/allimg/230730/003405-169064844553de.jpg',      //还是美女
    //     'https://pic.netbian.com/uploads/allimg/230930/172809-16960660897379.jpg',      //猫
    //     'https://pic.netbian.com/uploads/allimg/231008/110718-1696734438d0b9.jpg',      //云山
    //     'https://pic.netbian.com/uploads/allimg/231019/212949-169772218910a3.jpg',      //星空
    //     'https://pic.netbian.com/uploads/allimg/231019/213128-1697722288f1a3.jpg',      //海景
    //     'https://pic.netbian.com/uploads/allimg/231019/213128-1697722288f1a3.jpg',      //美女1
    // ]


    let backgroundImage = localStorage.getItem('backgroundImages');
    const [images, setImages] = useState('/Default-wallpaper.jpg');

    const reImagesUrl = async () => {
        // setCount(Math.floor(Math.random() * backgroundImages.length));
        // const imgUrl = backgroundImages[count]
        try {
            const response = await axios.get('/jfApi/home/bg/ajaxbg');
            const images = response.data;

            if (images.length > 0) {
                const firstImage = images[0].replace('/400', '');
                const imgUrl = 'https://i0.wp.com/www.jianfast.com' + firstImage;
                localStorage.setItem('backgroundImages', imgUrl);
                setImages(imgUrl);
            }
        } catch (error) {
            messageApi.info('获取壁纸出错')
        }
    }





    const handleRightClick = (event) => {
        event.preventDefault(); // 阻止默认的右键菜单弹出
        showOrNot.setEnglishDrawerShow(true);  // 打开英语抽屉
    };


    return (

        <div
            style={{
                height: '100vh',
                backgroundImage: `linear-gradient( rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.4)),url(${backgroundImage || images})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
            }}
        >
            {/* 全局提示 */}
            {contextHolder}

            {/* 漂浮在底层透明背景，用做 点击右键显示 抽屉 只能放在这上面，放到下面去写会挡住按钮 不知道为啥。*/}
            <div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '20%',
                    width: '60%',
                    height: '80%',
                    zIndex: 0
                    // backgroundColor: 'aliceblue',
                    // opacity: '15%',
                }}
                onContextMenu={handleRightClick}
            />
            {/* 书签 */}
            <Bookmarks messageApi={messageApi} />

            {/* 居中部分 */}
            <div className="App">
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
                        className='buttonOpacity'
                    />

                    {/*换壁纸*/}
                    <FloatButton
                        onClick={reImagesUrl}
                        icon={<PictureTwoTone />}
                        tooltip="点击换壁纸"
                        style={{ right: 80 }}
                        className='buttonOpacity'
                    />

                    {/*用户*/}
                    <FloatButton
                        icon={<UserOutlined />}
                        tooltip="用户"
                        style={{ right: 135 }}
                        className='buttonOpacity'
                        onClick={() => {
                            setModalIsOpen(true);
                        }}
                    />

                    {/* 侧边半透明的边 移动到上面显示抽屉 */}
                    <div
                        onMouseEnter={() => showOrNot.setMemoDrawerShow(true)}
                        style={{
                            width: 5,
                            position: 'fixed',
                            right: 0,
                            top: "20%",
                            height: '60%',
                            backgroundColor: 'aliceblue',
                            opacity: '15%'
                        }}
                    />

                    {/*备忘录抽屉*/}
                    <MemoDrawer />
                    {/*备忘英语抽屉*/}
                    <EnglishDrawer />
                </div>
            </div>
            <Modal
                open={modalIsOpen}
                onCancel={() => setModalIsOpen(false)}
                footer={<></>}
            >
                <span style={{ textAlign: 'center', display: 'block', margin: '0 auto' }}>
                    <p style={{ fontSize: 20 }}>请使用微信扫一扫关注登录</p>
                    <img src="/wxGzh.jpg" />
                    <Space.Compact style={{ width: '80%' }} size={"large"}>
                        <Input placeholder="请输入验证码" />
                        <Button type="primary" onClick={() => messageApi.info('抱一丝，路漫漫其修远兮，唔得慢慢完善')}>
                            验证登录
                        </Button>
                    </Space.Compact>
                    <p style={{ color: '#fa5555' }}>如已关注，请回复“<strong>登录</strong>”二字获取验证码进行登录</p>
                </span>
            </Modal>
        </div>
    );
}

export default observer(Home)