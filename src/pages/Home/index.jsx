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
import {reImagesUrl} from "../../request/homeRequest";


function Home() {
    const [modalIsOpen, setModalIsOpen] = useState(false);  // 弹出抽屉状态
    const [messageApi, contextHolder] = message.useMessage();


    let backgroundImage = localStorage.getItem('backgroundImages');
    const [images, setImages] = useState('/Default-wallpaper.jpg');

    /**
     * 获取壁纸
     */
    const reImages = async() => {
        const imgUrl = reImagesUrl();
        if (imgUrl){
            localStorage.setItem('backgroundImages', await imgUrl);
            setImages(await imgUrl);
        }
        else
            messageApi.info('获取壁纸出错');
    }

    /**
     * 登录
     */
    const login = async() => {
        const isLogin = login();
        if (isLogin) setModalIsOpen(false);
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
                        onClick={reImages}
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
                        <Button type="primary" onClick={() => login}>
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