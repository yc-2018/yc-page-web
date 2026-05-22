import React, {useEffect, useRef, useState} from "react";
import {Collapse} from 'antd-mobile'
import {useNavigate, useSearchParams} from 'react-router-dom';

import Md from "@/components/Md";
import {blogMenu} from "@/store/NoLoginData";
import {blogBaseURL, getBlogItemIconObj, getBlogList, getBlogMd} from "@/request/blogRequest";
import LoaderWhite from "@/components/common/LoaderWhite";
import CommonStore from "@/store/CommonStore";

export default () => {
  const [menu, setMenu] = useState(blogMenu)      // 菜单项
  const [icon, setIcon] = useState({})            // 菜单图标映射
  const [content, setContent] = useState('')      // 当前文章内容
  const [initLoad, setInitLoad] = useState(true)  // 初始加载菜单状态
  const [loading, setLoading] = useState(false)   // 文章加载状态
  const [selectKey, setSelectKey] = useState([])  // 当前文章 keyPath: [文章, 目录]
  const [openCatalog, setOpenCatalog] = useState(null) // 当前展开目录
  const [openArticle, setOpenArticle] = useState(null) // 当前展开文章
  const activeArticleRef = useRef(null)            // URL 直达时滚动到当前文章
  const navigate = useNavigate()                  // 路由跳转
  const [searchParams] = useSearchParams()        // URL 查询参数

  /** 初始化获取最新菜单和图标 */
  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      const blogIconObj = await getBlogItemIconObj();
      const blogList = await getBlogList();
      setIcon(blogIconObj)
      setMenu(blogList)
      await openArticleByUrl(blogList)
    }catch (e) {
      CommonStore.msg.error('寄了.获取菜单失败')
      console.error(e)
    }
    finally {
      setInitLoad(false)
    }
  }

  /** 读取 URL 参数并打开指定文章 */
  const openArticleByUrl = async (blogList) => {
    const itemValue = searchParams.get('item')
    if (!itemValue) return
    try {
      const currentKeys = JSON.parse(decodeURIComponent(itemValue));
      if (currentKeys?.length !== 2) return
      const blogCatalog = blogList.find(item => item[0] === currentKeys[1]); // 当前目录
      if (!blogCatalog) {
        setContent('# 没有找到对应的博客哦!')
        return setOpenCatalog(null)
      }
      if (!blogCatalog.some(item => item === currentKeys[0])) {
        setContent('# 没有找到对应的文章哦!')
        return setOpenCatalog(currentKeys[1])
      }
      await handleArticleClick(currentKeys, false, true)
    } catch (e) {
      setContent('# 参数异常')
      console.log('URL参数异常', e)
    }
  }

  /** 打开博客文章 */
  const handleArticleClick = async (keyPath, syncUrl = true, scrollIntoView = false) => {
    setLoading(true)
    setSelectKey(keyPath)
    setOpenCatalog(keyPath[1])
    setOpenArticle(keyPath[0])
    if (syncUrl) navigate(`?item=${encodeURIComponent(JSON.stringify(keyPath))}`)
    try {
      const data = await getBlogMd(keyPath)
      setContent(data)
    } catch (_) {
      setContent(`请求失败，请检查网络连接`)
    } finally {
      setLoading(false)
      if (scrollIntoView) scrollToActiveArticle()
    }
  }

  /** 将 URL 直达的文章滚动到视口顶部 */
  const scrollToActiveArticle = () => {
    window.setTimeout(() => {
      activeArticleRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    }, 100)
  }

  /** 切换文章展开项 */
  const handleArticleChange = (articleKey, parent) => {
    setOpenArticle(articleKey)
    if (articleKey) handleArticleClick([articleKey, parent])
  }

  /** 渲染当前文章内容 */
  const renderArticleContent = item =>
    selectKey[0] === item
      ? <div style={{wordBreak: 'break-all', overflowX: 'auto', padding: '0 4px 12px'}}>
          {loading ? <LoaderWhite/> : <Md>{content}</Md>}
        </div>
      : null

  /** 构建菜单 */
  const buildMenu = blogMenu =>
    <div style={{paddingBottom: 8}}>
      <Collapse accordion activeKey={openCatalog} onChange={setOpenCatalog}>
        {
          blogMenu.map(itemList =>
            <Collapse.Panel
              key={itemList[0]}
              title={
                <>
                  {icon[itemList[0]] && <img src={`${blogBaseURL}/icon/${icon[itemList[0]]}`} alt="图标"/>}
                  <span style={{marginLeft: 5}}>{itemList[0]}</span>
                </>}
            >
              <Collapse
                accordion
                activeKey={selectKey[1] === itemList[0] ? openArticle : null}
                onChange={articleKey => handleArticleChange(articleKey, itemList[0])}
              >
                {itemList.slice(1).map(item =>
                  <Collapse.Panel
                    key={item}
                    title={
                      <span ref={selectKey[0] === item && selectKey[1] === itemList[0] ? activeArticleRef : null}>
                        {item.replace('.md', '')}
                      </span>
                    }
                  >
                    {renderArticleContent(item)}
                  </Collapse.Panel>
                )}
              </Collapse>
            </Collapse.Panel>
          )
        }
      </Collapse>
    </div>

  return initLoad ? <LoaderWhite loadName="获取菜单中..."/> : buildMenu(menu)
}
