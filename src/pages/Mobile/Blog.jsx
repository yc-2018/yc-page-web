import React, {useEffect, useRef, useState} from "react";
import {Collapse, DotLoading, Toast} from 'antd-mobile'

import Md from "../../compontets/Md";
import {blogMenu} from "../../store/NoLoginData";
import {blogBaseURL, getBlogItemIconObj, getBlogList, getBlogMd} from "../../request/blogRequest";

export default () => {
  const [menu, setMenu] = useState(blogMenu)  // 菜单项
  const [icon, setIcon] = useState({})                 // 图标

  const loading = useRef()          // 显示加载中

  /** 初始化获取最新菜单和图标 */
  useEffect(() => {
    loading.current = Toast.show({icon: 'loading', content: '数据加载中...', duration: 0})
    getBlogItemIconObj().then(obj => {
      setIcon(obj)
      loading.current?.close()    // 关闭加载蒙版
      getBlogList().then(data => setMenu(data))
    }).catch(() => Toast.show({icon: 'fail', content: '数据加载失败'}))
  }, [])

  /** 构建菜单 */
  const buildMenu = blogMenu =>
    <Collapse accordion>
      {
        blogMenu.map(itemList =>
          <Collapse.Panel key={itemList[0]} title={<> <img src={`${blogBaseURL}/icon/${icon[itemList[0]]}`} alt="图标"/> {itemList[0]}</>}>
            <Collapse accordion>
              {itemList.slice(1).map(item =>
                <Collapse.Panel key={item} title={item}>
                  <DynamicContent keyPath={[item, itemList[0]]}/>
                </Collapse.Panel>
              )}
            </Collapse>
          </Collapse.Panel>
        )
      }
    </Collapse>

  return buildMenu(menu)
}

/** 异步内容组件 */
const DynamicContent = ({keyPath}) => {
  const [finished, setFinished] = useState(false)
  const [content, setContent] = useState('# 欢迎来到仰晨博客');

  useEffect(() => {
    getBlogMd(keyPath).then(data => {
      setContent(data)
    }).catch(() => {
      setContent(`请求失败，请检查网络连接`)
    }).finally(() => setFinished(true))
  }, [])

  return finished ?
    <div style={{width: '94vw', wordBreak: 'break-all'}}>
      <Md>{content}</Md>
    </div>
    :
    <DotLoading/>
}