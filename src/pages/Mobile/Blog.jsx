import UserStore from "../../store/UserStore";
import React from "react";

export default ()=>
    <div onClick={() => UserStore.clearJwt()}>退出登录</div>
