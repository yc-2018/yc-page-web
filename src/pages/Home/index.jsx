import React, { useState/* ,useEffect */ } from 'react';
import Search from './Search';
import Bookmarks from './Bookmarks';
import {Button, FloatButton, Input, message, Modal, Space, Radio, Spin} from "antd";
import {
    PictureTwoTone,
    SnippetsTwoTone,
    UserOutlined,
    SyncOutlined,
    DownloadOutlined,
    HomeTwoTone, PoweroffOutlined, SettingOutlined, CloudUploadOutlined, CloudDownloadOutlined
} from "@ant-design/icons";
import { observer } from 'mobx-react-lite'
import showOrNot from '../../store/ShowOrNot';
import "./Home.css"
import EnglishDrawer from "./EnglishDrawer";
import MemoDrawer from "./MemoDrawer";
import {reImagesUrl, login, uploadInfo} from "../../request/homeRequest";
import UserStore from "../../store/UserStore";
import JWTUtils from  "../../utils/JWTUtils"
import CommonStore from "../../store/CommonStore";
import axios from "axios";


function Home() {
    const [modalIsOpen, setModalIsOpen] = useState(false);           // 弹出登录框
    const [loginLoading, setLoginLoading] = useState(false);        // 点击登录按钮加载
    const [loginCaptcha, setLoginCaptcha] = useState(undefined);            // 登录验证码
    const [expireTime, setExpireTime] = useState(undefined);               // 登录有效时间
    const [images, setImages] = useState('/Default-wallpaper.jpg');// 背景壁纸
    const [messageApi, contextHolder] = message.useMessage();       // Hooks 调用全局提示（antd推荐）因为静态Message方法无法消费上下文，因而 ConfigProvider 的数据也不会生效。

    let backgroundImage = localStorage.getItem('backgroundImages'); // 尝试获取本地存储的壁纸URL

    /**
     * 获取壁纸请求
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
     * 登录请求
     */
    const goLogin = async() => {
        // 校验 loginCaptcha 是否为6位数字
        if (loginCaptcha?.length!== 6) {
            messageApi.error('验证码格式有误');
            return;
        }
        setLoginLoading(true);
        const isLogin =await login(loginCaptcha,expireTime);
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

                    {/*壁纸*/}
                    <FloatButton.Group
                        style={{ right: 80 }}
                        trigger="hover"
                        icon={<PictureTwoTone />}
                        className='buttonOpacity'
                    >
                        {UserStore.jwt&&
                        (
                            <>
                                {/* 上传壁纸到服务器 */}
                                <FloatButton
                                    icon={<CloudUploadOutlined />}
                                    tooltip="上传壁纸到服务器"
                                    className='buttonOpacity'
                                    onClick={()=>uploadInfo({backgroundUrl: images})}
                                />
                                {/*获取服务器壁纸 */}
                                <FloatButton
                                    icon={<CloudDownloadOutlined />}
                                    tooltip="获取服务器壁纸"
                                    className='buttonOpacity'
                                />
                            </>
                        )
                    }

                        {/* 下载壁纸 */}
                        <FloatButton
                            icon={<DownloadOutlined />}
                            tooltip="下载当前壁纸"
                            className='buttonOpacity'
                            onClick={async () => {
                                CommonStore.setLoading(true,'开始缓存该壁纸...');
                                try {
                                    const response = await axios.get(backgroundImage || images, {
                                        responseType: 'blob', // 重要：这会告诉 Axios 返回一个 Blob 对象
                                    });

                                    // 创建一个指向下载对象的 URL
                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', '仰晨背景.jpg'); // 或者任何你想要的文件名
                                    document.body.appendChild(link);
                                    link.click();

                                    // 清理并重置 URL
                                    window.URL.revokeObjectURL(url);
                                    link.remove();
                                    CommonStore.setLoading(false,'缓存完成,请保存');
                                } catch (error) {
                                    CommonStore.setLoading(false,'该图片无法直接下载,请在新标签页中保存')
                                    window.open(backgroundImage || images, '_blank'); // 在新标签页中打开图片
                                }
                            }}
                        />
                        {/*换壁纸*/}
                        <FloatButton
                            onClick={reImages}
                            icon={<SyncOutlined />}
                            tooltip={<div style={{textAlign: 'center'}} onClick={event=>event.stopPropagation()}>
                                <div>点击换缓慢的科技|风景壁纸:默认</div>
                                <Button onClick={()=>reImages("动画")}>加载快速的动画壁纸</Button>
                                <Button onClick={()=>reImages("随机")}>高清缓慢的随机壁纸</Button>
                                <Input placeholder="自定义壁纸链接，回车加载" onPressEnter={event => {
                                    localStorage.setItem('backgroundImages', event.target.value);
                                    setImages(event.target.value)
                                    messageApi.info('正在设置中...');
                                }}/>
                                </div> }
                            className='buttonOpacity'
                        />
                    </FloatButton.Group>

                    {UserStore.jwt?
                        (
                            /*用户登录后选项*/
                            <FloatButton.Group
                                trigger="hover"
                                icon={<HomeTwoTone />}
                                tooltip={"用户:"+JWTUtils.getName()}
                                style={{ right: 135 }}
                                className='buttonOpacity'
                             >
                                <FloatButton
                                    icon={<PoweroffOutlined />}
                                    tooltip="退出登录"
                                    style={{ right: 135 }}
                                    className='buttonOpacity'
                                    onClick={() => {
                                        UserStore.clearJwt()
                                    }}
                                />
                                <FloatButton
                                    icon={<SettingOutlined />}
                                    tooltip="页面样式配置"
                                    style={{ right: 135 }}
                                    className='buttonOpacity'
                                    onClick={() => {
                                        messageApi.info('还没写呢...');
                                    }}
                                />
                            </FloatButton.Group>
                        )
                        :
                        (
                            /*用户登录按钮*/
                            <FloatButton
                            icon={<UserOutlined />}
                            tooltip="用户登录"
                            style={{ right: 135 }}
                            className='buttonOpacity'
                            onClick={() => {
                                setModalIsOpen(true);
                            }}
                            />
                        )
                    }

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
                    <MemoDrawer setModalIsOpen={setModalIsOpen}/>
                    {/*备忘英语抽屉*/}
                    <EnglishDrawer />
                </div>
            </div>
            {/* 登录弹窗 */}
            <Modal
                open={modalIsOpen}
                onCancel={() => setModalIsOpen(false)}
                footer={<></>}
            >
                <span style={{ textAlign: 'center', display: 'block', margin: '0 auto' }}>
                    <p style={{ fontSize: 20 }}>请使用微信扫一扫关注登录</p>
                    <img src="/wxGzh.jpg"  alt="仰晨公众号二维码"/>

                    <Radio.Group
                        defaultValue="bt"
                        size="small"
                        style={{marginBottom:5}}
                        onChange={(e)=>setExpireTime(e.target.value)}
                    >
                        <Radio.Button disabled style={{color:'#85a2c7'}}>登录有效时长:</Radio.Button>
                        <Radio.Button value="bt">半天</Radio.Button>
                        <Radio.Button value="yt">一天</Radio.Button>
                        <Radio.Button value="yz">一周</Radio.Button>
                        <Radio.Button value="yy">一个月</Radio.Button>
                        <Radio.Button value="yn">一年</Radio.Button>
                    </Radio.Group>
                    <Space.Compact style={{ width: '80%' }} size={"large"}>
                        <Input placeholder="请输入验证码" value={loginCaptcha} onChange={(e) => setLoginCaptcha(e.target.value)} />
                        <Button type="primary" onClick={goLogin} loading={loginLoading}>
                            验证登录
                        </Button>
                    </Space.Compact>

                    <p style={{ color: '#fa5555' }}>如已关注，请回复“<strong>登录</strong>”二字获取验证码进行登录</p>
                </span>
            </Modal>
            {/* 加载动画 */}
            <Spin spinning={CommonStore.loading} fullscreen />
        </div>

    );
}

export default observer(Home)