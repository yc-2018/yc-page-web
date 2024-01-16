import React from 'react'
import UserStore from "../../store/UserStore";
import Memos from "./Memos";
import {observer} from "mobx-react-lite";
import Login from "./Login";
import './mobileCommom.css'
import JWTUtils from "../../utils/JWTUtils";

export default observer(() => !JWTUtils.isExpired()?(
        <>
            <div onClick={() => UserStore.clearJwt()}>退出登录</div>
            <Memos/>
        </>
    ): <Login/>
)