import React from 'react'
import UserStore from "../../store/UserStore";
import Memo from "./Memo";
import {observer} from "mobx-react-lite";
import Login from "./Login";

export default observer(() => UserStore.jwt?(
        <>
            <div onClick={() => UserStore.clearJwt()}>退出登录</div>
            <Memo/>
        </>
    ): <Login/>
)