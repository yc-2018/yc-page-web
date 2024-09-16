import React, {useEffect, useState} from "react";
import {Collapse, DotLoading} from 'antd-mobile'

import Md from "../../compontets/Md";
import {blogMenu} from "../../store/NoLoginData";
import {blogBaseURL, getBlogItemIconObj, getBlogList, getBlogMd} from "../../request/blogRequest";
import LoaderWhite from "../../compontets/common/LoaderWhite";
import CommonStore from "../../store/CommonStore";

let menu = blogMenu;  // 菜单项
let icon = {}                            // 图标
let initLoad = true                 // 初始加载菜单状态
let sxIndex = 0                     // 刷新页面状态变量
export default () => {
  const [, setSxYm] = useState(0)   // 刷新页面状态
  const sxYm = () => setSxYm(++sxIndex)
  
  
  /** 初始化获取最新菜单和图标 */
  useEffect(() => {
    init()
  }, [])
  
  const init = async () => {
    try {
      icon = await getBlogItemIconObj();
      menu = await getBlogList();
    }catch (e) {
      CommonStore.msg.error('寄了.获取菜单失败')
      console.error(e)
    }
    finally {
      sxYm(initLoad = false)
    }
  }
  
  /** 构建菜单 */
  const buildMenu = blogMenu =>
    <Collapse accordion>
      {
        blogMenu.map(itemList =>
          <Collapse.Panel key={itemList[0]} title={<> <img src={`${blogBaseURL}/icon/${icon[itemList[0]]}`}
                                                           alt="图标"/> {itemList[0]}</>}>
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
  
  return initLoad ? <LoaderWhite loadName="获取菜单中..."/> : buildMenu(menu)
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