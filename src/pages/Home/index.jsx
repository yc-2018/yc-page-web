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
import {reImagesUrl,login} from "../../request/homeRequest";


function Home() {
    const [modalIsOpen, setModalIsOpen] = useState(false);          // 弹出抽屉状态
    const [loginLoading, setLoginLoading] = useState(false);        // 点击登录按钮加载
    const [loginCaptcha, setLoginCaptcha] = useState(undefined);    // 登录验证码
    const [images, setImages] = useState('/Default-wallpaper.jpg'); // 背景壁纸
    const [messageApi, contextHolder] = message.useMessage();       // Hooks 调用全局提示（antd推荐）因为静态Message方法无法消费上下文，因而 ConfigProvider 的数据也不会生效。

    let backgroundImage = localStorage.getItem('backgroundImages');

    /**
     * 获取壁纸
     */
    const reImages = async(bzType) => {
        const imgUrl = reImagesUrl(bzType);
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
    const goLogin = async() => {
        // 校验 loginCaptcha 是否为6位数字
        if (loginCaptcha?.length!== 6) {
            messageApi.error('验证码格式有误');
            return;
        }
        setLoginLoading(true);
        const isLogin =await login(loginCaptcha);
        setLoginLoading(false);
        console.log(isLogin);
        if (isLogin) {
            setLoginCaptcha(undefined); // 验证码清空
            setModalIsOpen(false);      // 关闭弹出弹窗
        }
    }


    return (

        <div
            style={{
                height: '100vh',
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundImage: `linear-gradient( rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.4)),url(${backgroundImage || images})`,
            }}
        >
            {/* 全局提示 */}
            {contextHolder}

            {/* 《为了打开英语抽屉漂浮在底层透明背景》用做 点击右键显示 抽屉 只能放在这上面，放到下面去写会挡住按钮 不知道为啥。*/}
            <div
                style={{position: 'absolute',bottom: '10%',right: '20%',width: '60%', height: '80%', zIndex: 0}}
                onContextMenu={(event) => {
                    event.preventDefault();                 // 阻止默认的右键菜单弹出
                    showOrNot.setEnglishDrawerShow(true);  // 打开英语抽屉
                }}
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
                        tooltip={<div style={{textAlign: 'center'}}>
                            <div>点击换缓慢的风景壁纸:默认</div>
                            <Button onClick={()=>{reImages("动画");console.log("动画")}}>加载快速的动画壁纸</Button>
                            <Button onClick={()=>{reImages("随机");console.log("随机")}}>高清缓慢的随机壁纸</Button>
                            </div> }
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
                        <Input placeholder="请输入验证码" value={loginCaptcha} onChange={(e) => setLoginCaptcha(e.target.value)} />
                        <Button type="primary" onClick={goLogin} loading={loginLoading}>
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