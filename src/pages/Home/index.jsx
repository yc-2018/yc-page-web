import React, {useState, useEffect} from 'react';
import axios from "axios";
import {observer} from 'mobx-react-lite'
import TextArea from "antd/es/input/TextArea";
import {Avatar, Button, Popover, Tooltip} from "antd";
import {
  PictureTwoTone,
  SnippetsTwoTone,
  UserOutlined,
  SyncOutlined,
  DownloadOutlined,
  PoweroffOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  QuestionCircleTwoTone,
  EditOutlined, LayoutTwoTone,
  ReadOutlined, ProductOutlined, LinkOutlined,
} from "@ant-design/icons";
import {useNavigate} from 'react-router-dom'

import JWTUtils from "@/utils/JWTUtils"
import Filing from "@/components/Filing";
import showOrNot from '@/store/ShowOrNot';
import UserStore from "@/store/UserStore";
import CommonStore from "@/store/CommonStore";
import {reImagesUrl, updateUserConfig, getBg, getNameAndAvatar} from "@/request/homeApi";
import Bookmarks from "@/pages/Home/Bookmarks";
import {getToolsList, toolsBaseURL} from "@/request/toolsRequest";
import HomeSearch from "@/pages/Home/HomeSearch";
import HomeLink from "@/pages/Home/HomeLink";
import {_getBackgroundUrl, _setNameAndAvatar, _setBackgroundUrl} from "@/utils/localStorageUtils";
import "@/pages/Home/Home.css"


function Home() {
  const [bgImg, setBgImg] = useState('/Default-wallpaper.jpg');// 背景背景
  const [info, setInfo] = useState({});
  const [tools, setTools] = useState([]);

  const {msg} = CommonStore;
  const navigate = useNavigate()   // 路由跳转
  let {jwt} = UserStore;

  /** 初始化背景 和头像名称 */
  useEffect(() => {
    const bgUrl = _getBackgroundUrl();
    if (bgUrl) setBgImage(bgUrl);
    if (!bgUrl && !JWTUtils.isExpired()) {
      getBg().then(info => {
        if (info.data?.backgroundUrl) setBgImage(info.data.backgroundUrl);
      })
    }
    // 头像 昵称
    if (!JWTUtils.isExpired()) {
      getNameAndAvatar().then(info => {
        if (info.data?.avatar) {
          setInfo(info.data ?? {});
          _setNameAndAvatar(info.data);
        }
      })
    }
  }, [jwt])

  /** 获取工具 */
  useEffect(() => {
    getToolsList().then(dataList => setTools(dataList)).catch(() => {
      CommonStore.msg.error('获取工具列表失败');
    })
  }, [])

  /**
   * 获取背景请求
   */
  const reImages = async (bzType) => {
    const imgUrl = await reImagesUrl(bzType);
    if (imgUrl) setBgImage(imgUrl, '获取背景成功，喜欢的话请手动点击上传到云端☁');
    else msg.error('获取背景出错');
  }

  /** 保存背景URL到本地 */
  const setBgImage = (backgroundUrl, msg = null) => {
    _setBackgroundUrl(backgroundUrl);
    setBgImg(backgroundUrl);
    return msg && CommonStore.msg.info(msg);
  }

  /** 获取背景图片 */
  const getBgImg = () => {
    getBg().then(info => {
      if (info.data?.backgroundUrl) setBgImage(info.data.backgroundUrl);
      else msg.error('您还没有上传过背景到服务器哦');
    })
  }

  /** 下载背景图片 */
  const xzTp = async () => {
    CommonStore.setLoading(true, '开始缓存该背景...');
    try {
      const response = await axios.get(bgImg, {
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
      CommonStore.setLoading(false, '缓存完成,请保存');
    } catch (error) {
      CommonStore.setLoading(false, '该图片无法直接下载,请在新标签页中保存')
      window.open(bgImg, '_blank'); // 在新标签页中打开图片
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage: `linear-gradient( rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.4)),url(${bgImg})`,
      }}
    >

      {/* 《为了打开英语抽屉漂浮在底层透明背景》用做 点击右键显示 抽屉 只能放在这上面，放到下面去写会挡住按钮 不知道为啥。*/}
      <div
        style={{position: 'absolute', bottom: '10%', right: '20%', width: '60%', height: '80%', zIndex: 0}}
        onContextMenu={event => {
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
            <i className="anticon anticon-user"/>
          </div>
          <br/>
          {/*搜索框*/}
          <HomeSearch/>

          {/* 大图标书签 */}
          <HomeLink/>

          <div className="bottomMenu">
            {/*显示备忘录***********************************************************/}
            <Tooltip title="点击弹出备忘录">
              <Button
                size="large"
                shape="circle"
                className="buttonOpacity"
                icon={<SnippetsTwoTone/>}
                onClick={() => showOrNot.setMemoDrawerShow(true)}
              />
            </Tooltip>

            {/*页面设置***********************************************************/}
            <Tooltip title="页面设置">
              <Button
                size="large"
                shape="circle"
                className="buttonOpacity"
                icon={<LayoutTwoTone/>}
                onClick={() => msg.info('没什么好设置的')}
              />
            </Tooltip>

            {/*跳转到帮助***********************************************************/}
            <Tooltip title="帮助">
              <Button
                size="large"
                shape="circle"
                className="buttonOpacity"
                icon={<QuestionCircleTwoTone/>}
                onClick={() => navigate('/help')}
              />
            </Tooltip>

            {/*背景***********************************************************/}
            <Popover
              title={<div style={{textAlign: 'center', fontWeight: 'bold'}}>背景图</div>}
              content={
                <div className="bottomMenuItemButton">
                  {jwt &&
                    <>
                      <div onClick={getBgImg}><CloudDownloadOutlined/> 从服务器获取背景</div>
                      <div onClick={() => updateUserConfig({backgroundUrl: bgImg})}>
                        <CloudUploadOutlined/> 上传背景到服务器
                      </div>
                    </>
                  }
                  <div onClick={xzTp}><DownloadOutlined/> 下载背景图片</div>
                  <div className="bottomMenuItemButton">
                    <b style={{textAlign: 'center', display: 'block'}}>换背景</b>
                    <div onClick={() => reImages("bing")}><SyncOutlined/> bing随机壁纸</div>
                    <div onClick={() => reImages("风景")}><SyncOutlined/> 风景背景(慢)</div>
                    <div onClick={() => reImages("漫画")}><SyncOutlined/> 漫画背景</div>
                    <TextArea
                      rows={4}
                      allowClear
                      placeholder="自定义背景链接，回车加载"
                      onPressEnter={event => {
                        if (/^(http|https):\/\/.+/.test(event.target.value))
                          setBgImage(event.target.value, '正在设置中...') // 设置背景
                        else msg.error('请输入正确的链接');
                      }}
                    />
                  </div>
                </div>
              }
            >
              <Button
                size="large"
                shape="circle"
                className="buttonOpacity"
                icon={<PictureTwoTone/>}
              />
            </Popover>

            {jwt ?
              <Popover  // 用户信息***********************************************************/
                title={<div style={{textAlign: 'center', fontWeight: 'bold'}}>{"用户:" + info.username}</div>}
                content={
                  <div style={{display: 'flex', gap: 8, flexDirection: 'column'}}>
                    <Button
                      block
                      icon={<EditOutlined/>}
                      onClick={() => UserStore.setInfoModal(true)}
                    >
                      修改信息
                    </Button>
                    <Button
                      block
                      icon={<PoweroffOutlined/>}
                      onClick={() => {
                        UserStore.clearJwt()
                        window.location.reload();
                      }}
                    >
                      退出登录
                    </Button>
                  </div>
                }
              >
                <Button
                  size="large"
                  shape="circle"
                  className="buttonOpacity"
                  icon={
                    <Avatar
                      size={30}
                      style={{backgroundColor: '#FFFFFF72', position: 'relative'}}
                      src={info.avatar}
                      icon={<UserOutlined style={{color: 'blue'}}/>}
                    />}
                />
              </Popover>
              :
              // 用户登录***********************************************************
              <Tooltip title="用户登录">
                <Button
                  size="large"
                  shape="circle"
                  className="buttonOpacity"
                  icon={<UserOutlined/>}
                  onClick={() => UserStore.setOpenModal(true)}
                />
              </Tooltip>
            }

            {/*跳转到博客***********************************************************/}
            <Tooltip title="跳转到博客">
              <Button
                size="large"
                shape="circle"
                className="buttonOpacity"
                icon={<ReadOutlined style={{color: '#1677ff', fontSize: 20}}/>}
                onClick={() => navigate('/blog')}
              />
            </Tooltip>

            {/*打开工具***********************************************************/}
            <Popover
              title={<div style={{textAlign: 'center'}}>仰晨工具箱</div>}
              content={
                <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
                  <Button block onClick={() => navigate('/utils-specialChar')}>特殊字母|数字</Button>
                  {tools.map(([name, uri]) =>
                    <Button key={name} block onClick={() => window.open(toolsBaseURL + uri, '_blank')}>
                      <LinkOutlined/>{name}
                    </Button>
                  )}
                </div>
              }
            >
              <Button
                size="large"
                shape="circle"
                className="buttonOpacity"
                onClick={() => window.open(toolsBaseURL, '_blank')}
                onContextMenu={e => e.preventDefault() || navigate('/seeTime')}
                icon={<ProductOutlined style={{color: '#1677ff', fontSize: 20}}/>}
              />
            </Popover>

          </div>

          {/* 侧边半透明的边 移动到上面显示抽屉 */}
          <div
            onMouseEnter={() => showOrNot.setMemoDrawerShow(true)}
            style={{
              width: 5,
              position: 'fixed',
              right: 0,
              top: "35%",
              height: '50%',
              backgroundColor: 'aliceblue',
              opacity: '15%'
            }}
          />

        </div>
      </div>
      {/*备案号显示*/}
      <Filing/>
    </div>
  );
}

export default observer(Home)
