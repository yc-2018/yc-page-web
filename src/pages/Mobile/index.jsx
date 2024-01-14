import React from 'react'
import UserStore from "../../store/UserStore";
import Memo from "./Memo";
import {observer} from "mobx-react-lite";

export default observer(() => UserStore.jwt?(
        <>
            <div onClick={() => UserStore.clearJwt()}>退出登录</div>
            <Memo/>
        </>
    ):(
        <div onClick={() => UserStore.setOpenModal(true)}>
            请先登录
        </div>
    )
)