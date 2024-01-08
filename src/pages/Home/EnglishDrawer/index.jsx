import { observer } from 'mobx-react-lite'
import React, {useEffect} from "react";
import {Button, Divider, Drawer, List, Skeleton} from "antd";

import showOrNot from "../../../store/ShowOrNot";
import UserStore from "../../../store/UserStore";


let init = true // 第一次加载
function EnglishDrawer() {
        useEffect(() => {
                if (init && showOrNot.englishDrawerShow && UserStore.jwt) {
                        init = false
                        console.log('████████████████████████████████████', showOrNot.englishDrawerShow)

                }
        }, [showOrNot.englishDrawerShow])


    return (
        <Drawer placement="left"
                closeIcon={false}
                style={{ opacity: 0.8 }}
                open={showOrNot.englishDrawerShow}
                onClose={() => showOrNot.setEnglishDrawerShow(false)}
                title={<>备忘英语</>}
        >
            {UserStore.jwt ?
                <List>
                    <p>按时睡觉，不按时睡觉，你就是个loser</p>
                    <p>left:左侧</p>
                    <p>right:右侧</p>
                    <p>Redux react的数据管理</p>
                    <p>CentOS</p>
                    <p>message 消息</p>
                    <p>Layout 布局</p>
                </List>
                :
                <div className='loadMore' onClick={() => UserStore.setOpenModal(true)}>
                    <Divider plain>🥺<Button type="link">请先登录</Button>🐾</Divider>

                    <Skeleton/>
                    <Skeleton/>
                    <Skeleton/>
                </div>
            }

        </Drawer>
    )
}

export default observer(EnglishDrawer)