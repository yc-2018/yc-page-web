import React, { useState ,useEffect  } from 'react';
import axios from "axios";
import Bookmarks from './Bookmarks';
import { observer } from 'mobx-react-lite'
import {Button, FloatButton, Input, Modal, Space, Radio, Spin} from "antd";
import {
    PictureTwoTone,
    SnippetsTwoTone,
    UserOutlined,
    SyncOutlined,
    DownloadOutlined,
    HomeTwoTone,
    PoweroffOutlined,
    SettingOutlined,
    CloudUploadOutlined,
    CloudDownloadOutlined,
    QuestionCircleTwoTone,
    SmileTwoTone
} from "@ant-design/icons";
import {useNavigate} from 'react-router-dom'

import Search from './Search';
import showOrNot from '../../store/ShowOrNot';
import EnglishDrawer from "./EnglishDrawer";
import MemoDrawer from "./MemoDrawer";
import {reImagesUrl, login, uploadInfo, getPageInfo} from "../../request/homeRequest";
import UserStore from "../../store/UserStore";
import CommonStore from "../../store/CommonStore";
import JWTUtils from  "../../utils/JWTUtils"
import Msg from "../../store/Msg";
import "./Home.css"


function Home() {
    const [modalIsOpen, setModalIsOpen] = useState(false);           // 弹出登录框
    const [loginLoading, setLoginLoading] = useState(false);        // 点击登录按钮加载
    const [loginCaptcha, setLoginCaptcha] = useState(undefined);            // 登录验证码
    const [expireTime, setExpireTime] = useState(undefined);               // 登录有效时间
    const [images, setImages] = useState('/Default-wallpaper.jpg');// 背景背景

    const navigate = useNavigate()   // 路由跳转
    let backgroundImage = localStorage.getItem('backgroundImages'); // 尝试获取本地存储的背景URL
    let {jwt} = UserStore;

    useEffect(() => {
        if(jwt)(async()=> {
            // 获取云端保存的页面信息
            const info = await getPageInfo()
            if (info?.backgroundUrl) setBgImage(info.backgroundUrl);

        })();
    },[jwt])

    /**
     * 获取背景请求
     */
    const reImages = async(bzType) => {
        const imgUrl = await reImagesUrl(bzType);
        if (imgUrl) setBgImage(imgUrl, '获取背景成功，喜欢的话请手动点击上传到云端☁');
        else Msg.msg.info('获取背景出错');
    }

    /**  获取本地记录背景URL */
    const getBgImage = () =>  backgroundImage || images

    /** 保存背景URL到本地 */
    const setBgImage = (backgroundUrl,msg=null)=> {
        localStorage.setItem('backgroundImages', backgroundUrl);
        setImages(backgroundUrl);
        return msg && Msg.msg.info(msg);
    }

    /**
     * 登录请求
     */
    const goLogin = async() => {
        // 校验 loginCaptcha 是否为6位数字
        if (loginCaptcha?.length!== 6) {
            Msg.msg.error('验证码格式有误');
            return;
        }
        setLoginLoading(true);
        const isLogin =await login(loginCaptcha,expireTime);
        setLoginLoading(false);

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
                backgroundImage: `linear-gradient( rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.4)),url(${getBgImage()})`,
            }}
        >

            {/* 《为了打开英语抽屉漂浮在底层透明背景》用做 点击右键显示 抽屉 只能放在这上面，放到下面去写会挡住按钮 不知道为啥。*/}
            <div
                style={{position: 'absolute',bottom: '10%',right: '20%',width: '60%', height: '80%', zIndex: 0}}
                onContextMenu={(event) => {
                    event.preventDefault();                 // 阻止默认的右键菜单弹出
                    showOrNot.setEnglishDrawerShow(true);  // 打开英语抽屉
                }}
            />

            {/* 书签 */}
            <Bookmarks/>

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

                    {/*背景*/}
                    <FloatButton.Group
                        style={{ right: 80 }}
                        trigger="hover"
                        icon={<PictureTwoTone />}
                        className='buttonOpacity'
                    >
                        {jwt &&
                        (
                            <>
                                {/*获取服务器背景 */}
                                <FloatButton
                                    icon={<CloudDownloadOutlined />}
                                    tooltip="获取云端背景"
                                    className='buttonOpacity'
                                    onClick={async()=> {
                                        const {backgroundUrl} = await getPageInfo()
                                        if (backgroundUrl) setBgImage(backgroundUrl,'获取背景成功')   // 设置背景
                                         else Msg.msg.error('您还没有上传过背景到服务器哦');
                                    }}
                                />

                                {/* 上传背景到服务器 */}
                                <FloatButton
                                    icon={<CloudUploadOutlined />}
                                    tooltip="上传背景到云端"
                                    className='buttonOpacity'
                                    onClick={()=>uploadInfo({backgroundUrl: getBgImage()})}
                                />
                            </>
                        )
                    }

                        {/* 下载背景 */}
                        <FloatButton
                            icon={<DownloadOutlined />}
                            tooltip="下载当前背景"
                            className='buttonOpacity'
                            onClick={async () => {
                                CommonStore.setLoading(true,'开始缓存该背景...');
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
                        {/*换背景*/}
                        <FloatButton
                            onClick={reImages}
                            icon={<SyncOutlined />}
                            tooltip={<div style={{textAlign: 'center'}} onClick={event=>event.stopPropagation()}>
                                <div>点击换缓慢的科技|风景背景:默认</div>
                                <Button onClick={()=>reImages("动画")}>加载快速的动画背景</Button>
                                <Button onClick={()=>reImages("随机")}>高清缓慢的随机背景</Button>
                                <Input placeholder="自定义背景链接，回车加载" onPressEnter={event => {
                                    if (/^(http|https):\/\/.+/.test(event.target.value))
                                        setBgImage(event.target.value,'正在设置中...') // 设置背景
                                    else Msg.msg.error('请输入正确的链接');
                                }}/>
                                </div> }
                            className='buttonOpacity'
                        />
                    </FloatButton.Group>

                    {jwt?
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
                                        window.location.reload();
                                    }}
                                />
                                <FloatButton
                                    icon={<SettingOutlined />}
                                    tooltip="页面样式配置"
                                    style={{ right: 135 }}
                                    className='buttonOpacity'
                                    onClick={() => {
                                        Msg.msg.info('还没写呢...');
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

                    {/*跳转到帮助*/}
                    <FloatButton
                        onClick={() => navigate('/help') }
                        icon={<QuestionCircleTwoTone />}
                        tooltip="帮助"
                        style={{ right: 190 }}
                        className='buttonOpacity'
                    />

                    {/*跳转到博客*/}
                    <FloatButton
                        onClick={() => navigate('/blog') }
                        icon={<SmileTwoTone />}
                        tooltip="博客"
                        style={{ right: 245 }}
                        className='buttonOpacity'
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
                    <MemoDrawer setModalIsOpen={setModalIsOpen}/>
                    {/*备忘英语抽屉*/}
                    <EnglishDrawer />
                </div>
            </div>
            {/* 登录弹窗 */}
            <Modal
                zIndex={1001}
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