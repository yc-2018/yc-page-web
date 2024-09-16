import React, {useState, useEffect} from 'react';
import axios from "axios";
import {observer} from 'mobx-react-lite'
import {Avatar, Button, FloatButton, Input, Slider} from "antd";
import {
  PictureTwoTone,
  SnippetsTwoTone,
  UserOutlined,
  SyncOutlined,
  DownloadOutlined,
  PoweroffOutlined,
  SettingOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  QuestionCircleTwoTone,
  SmileTwoTone, EditOutlined, LayoutTwoTone
} from "@ant-design/icons";
import {useNavigate} from 'react-router-dom'

import "./Home.css"
import Search from './Search';
import Bookmarks from './Bookmarks';
import JWTUtils from "../../utils/JWTUtils"
import Filing from "../../compontets/Filing";
import showOrNot from '../../store/ShowOrNot';
import UserStore from "../../store/UserStore";
import SearchStore from "../../store/SearchStore";
import CommonStore from "../../store/CommonStore";
import {reImagesUrl, uploadInfo, getPageInfo} from "../../request/homeRequest";


function Home() {
  const [images, setImages] = useState('/Default-wallpaper.jpg');// 背景背景

  const {msg} = CommonStore;
  const navigate = useNavigate()   // 路由跳转
  let backgroundImage = localStorage.getItem('backgroundImages'); // 尝试获取本地存储的背景URL
  let {jwt} = UserStore;

  useEffect(() => {
    if (!JWTUtils.isExpired() && !backgroundImage) (async () => {
      // 获取云端保存的页面信息
      const info = await getPageInfo()
      if (info?.backgroundUrl) setBgImage(info.backgroundUrl);

    })();
  }, [jwt])

  /**
   * 获取背景请求
   */
  const reImages = async (bzType) => {
    const imgUrl = await reImagesUrl(bzType);
    if (imgUrl) setBgImage(imgUrl, '获取背景成功，喜欢的话请手动点击上传到云端☁');
    else msg.error('获取背景出错');
  }

  /**  获取本地记录背景URL */
  const getBgImage = () => backgroundImage || images

  /** 保存背景URL到本地 */
  const setBgImage = (backgroundUrl, msg = null) => {
    localStorage.setItem('backgroundImages', backgroundUrl);
    setImages(backgroundUrl);
    return msg && CommonStore.msg.info(msg);
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
          <Search/>

          {/*显示备忘录***********************************************************/}
          <FloatButton
            onClick={() => showOrNot.setMemoDrawerShow(true)}
            icon={<SnippetsTwoTone/>}
            tooltip="点击弹出备忘录"
            className='buttonOpacity'
          />

          {/*背景***********************************************************/}
          <FloatButton.Group
            style={{right: 80}}
            trigger="hover"
            icon={<PictureTwoTone/>}
            className='buttonOpacity'
          >
            {jwt &&
              (
                <>
                  {/*获取服务器背景 */}
                  <FloatButton
                    icon={<CloudDownloadOutlined/>}
                    tooltip="获取云端背景"
                    className='buttonOpacity'
                    onClick={async () => {
                      const {backgroundUrl} = await getPageInfo()
                      if (backgroundUrl) setBgImage(backgroundUrl, '获取背景成功')   // 设置背景
                      else msg.error('您还没有上传过背景到服务器哦');
                    }}
                  />

                  {/* 上传背景到服务器 */}
                  <FloatButton
                    icon={<CloudUploadOutlined/>}
                    tooltip="上传背景到云端"
                    className='buttonOpacity'
                    onClick={() => uploadInfo({backgroundUrl: getBgImage()})}
                  />
                </>
              )
            }

            {/* 下载背景 */}
            <FloatButton
              icon={<DownloadOutlined/>}
              tooltip="下载当前背景"
              className='buttonOpacity'
              onClick={async () => {
                CommonStore.setLoading(true, '开始缓存该背景...');
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
                  CommonStore.setLoading(false, '缓存完成,请保存');
                } catch (error) {
                  CommonStore.setLoading(false, '该图片无法直接下载,请在新标签页中保存')
                  window.open(backgroundImage || images, '_blank'); // 在新标签页中打开图片
                }
              }}
            />
            {/*换背景*/}
            <FloatButton
              onClick={() => reImages("bing")}
              icon={<SyncOutlined/>}
              tooltip={<div style={{textAlign: 'center'}} onClick={event => event.stopPropagation()}>
                <div>默认bing随机壁纸当背景</div>
                <Button onClick={() => reImages("风景")}>(慢)风景背景</Button>
                <Button onClick={() => reImages("漫画")}>漫画背景</Button>
                <Input placeholder="自定义背景链接，回车加载" onPressEnter={event => {
                  if (/^(http|https):\/\/.+/.test(event.target.value))
                    setBgImage(event.target.value, '正在设置中...') // 设置背景
                  else msg.error('请输入正确的链接');
                }}/>
              </div>}
              className='buttonOpacity'
            />
          </FloatButton.Group>

          {jwt ?
            (
              /*用户登录后选项***********************************************************/
              <FloatButton.Group
                trigger="hover"
                icon={  // 头像
                  <Avatar size={30}
                          style={{backgroundColor: '#FFFFFF72',position:'relative',left:'-5px'}}
                          src={JWTUtils.getAvatar()}
                          icon={<UserOutlined style={{color: 'blue'}}/>}
                  />
                }
                tooltip={"用户:" + JWTUtils.getName()}
                style={{right: 135, opacity: .5}}
                className='buttonOpacity'
              >
                <FloatButton
                  icon={<PoweroffOutlined/>}
                  tooltip="退出登录"
                  className='buttonOpacity'
                  onClick={() => {
                    UserStore.clearJwt()
                    window.location.reload();
                  }}
                />
                <FloatButton
                  icon={<EditOutlined />}
                  tooltip="修改信息"
                  className='buttonOpacity'
                  onClick={() => UserStore.setInfoModal(true)}
                />
              </FloatButton.Group>
            )
            :
            (
              /*用户登录按钮***********************************************************/
              <FloatButton
                icon={<UserOutlined/>}
                tooltip="用户登录"
                style={{right: 135}}
                className='buttonOpacity'
                onClick={() => {
                  UserStore.setOpenModal(true);
                }}
              />
            )
          }
          
          {/*页面设置***********************************************************/}
          <FloatButton.Group
            trigger="hover"
            icon={<LayoutTwoTone />}
            tooltip="页面设置"
            style={{right: 190, opacity: .5}}
            className='buttonOpacity'
          >
            <FloatButton
              icon={<SettingOutlined/>}
              tooltip={
                <div onClick={event => event.stopPropagation()}>
                  <div style={{textAlign: 'center'}}>页面样式配置</div>
                  
                  <label>
                    <input
                      type="checkbox"
                      checked={SearchStore.quickSearchIcon}
                      onChange={e => SearchStore.setQuickSearchIcon(e.target.checked)}
                    />
                    快速搜索是否显示图标
                  </label>
                  <div style={{textAlign: 'center',margin:'5px 20px'}}>
                    快速搜索图标的透明度
                  <Slider
                    min={10}
                    max={90}
                    value={SearchStore.searchIconTransparency}
                    disabled={!SearchStore.quickSearchIcon}
                    onChange={value => SearchStore.setSearchIconTransparency(value)}
                    styles={{
                    track: {
                      background: '#FFF',
                    },
                    tracks: {
                      background: "#a46e6e",
                    },
                    rail:{
                      background: "#7b7b7b",
                    },
                  }}/>
                  </div>
                  
                </div>
              }
              className='buttonOpacity'
              onClick={() => {
                msg.info('未完待续...');
              }}
            />
          </FloatButton.Group>

          {/*跳转到帮助***********************************************************/}
          <FloatButton
            onClick={() => navigate('/help')}
            icon={<QuestionCircleTwoTone/>}
            tooltip="帮助"
            style={{right: 245}}
            className='buttonOpacity'
          />

          {/*跳转到博客***********************************************************/}
          <FloatButton
            onClick={() => navigate('/blog')}
            onContextMenu={e => e.preventDefault() || navigate('/seeTime')}
            icon={<SmileTwoTone/>}
            tooltip="博客"
            style={{right: 300}}
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

        </div>
      </div>
      {/*备案号显示*/}
      <Filing/>
      
    </div>

  );
}

export default observer(Home)