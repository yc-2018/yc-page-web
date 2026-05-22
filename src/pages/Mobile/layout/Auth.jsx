import React, {lazy} from 'react'
import {Outlet} from 'react-router-dom'
import {observer} from 'mobx-react-lite'

import JWTUtils from '@/utils/JWTUtils'

const Login = lazy(() => import('../pages/Login'))

/** 需要登录的移动端页面守卫 */
const MobileAuth = observer(() =>
  JWTUtils.isExpired() ? <Login/> : <Outlet/>
)

export default MobileAuth
