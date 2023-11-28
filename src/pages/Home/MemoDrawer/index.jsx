import {observer} from 'mobx-react-lite'
import showOrNot from "../../../store/ShowOrNot";
import {Drawer} from "antd";
import React from "react";

const MemoDrawer = observer(() => {


        return (
            <Drawer title="备忘录" placement="right" onClose={() => showOrNot.setMemoDrawerShow(false)}
                    open={showOrNot.memoDrawerShow} style={{opacity: 0.8}}>
                <p>按时睡觉，不按时睡觉，你就是个loser</p>
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
                <p>Some contents...</p>

            </Drawer>
        )
    }
)
export default MemoDrawer