import React from 'react'
import {Navigate} from 'react-router-dom'

/** 移动端未知路径回到待办首页 */
const MobileFallback = () => <Navigate to="/" replace/>

export default MobileFallback
