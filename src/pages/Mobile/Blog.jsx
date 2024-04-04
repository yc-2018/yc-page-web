import React, {useEffect, useState} from "react";
import {Collapse, DotLoading} from 'antd-mobile'

import Md from "../../compontets/Md";
import {blogMenu} from "../../store/NoLoginData";
import {getBlogList, getBlogMd} from "../../request/blogRequest";

export default () => {
  const [menu, setMenu] = useState(blogMenu)                  // 菜单项

  /** 初始化获取最新菜单 */
  useEffect(() => {getBlogList().then(data => setMenu(data))}, [])

  /** 构建菜单 */
  const buildMenu = blogMenu =>
    <Collapse accordion>
      {
        blogMenu.map(itemList =>
          <Collapse.Panel key={itemList[0]} title={itemList[0]}>
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