import { observer } from 'mobx-react-lite'
import showOrNot from "../../../store/ShowOrNot";
import {Drawer} from "antd";

function EnglishDrawer() {


    return (
        <Drawer title="备忘英语" placement="left" onClose={() => showOrNot.setEnglishDrawerShow(false)} open={showOrNot.englishDrawerShow} style={{ opacity: 0.8 }}>
            <p>按时睡觉，不按时睡觉，你就是个loser</p>
            <p>left:左侧</p>
            <p>right:右侧</p>
            <p>Redux react的数据管理</p>
            <p>CentOS</p>
            <p>message 消息</p>
            <p>Layout 布局</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Drawer>
            )
}

export default observer(EnglishDrawer)