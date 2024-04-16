import React from "react";
/**
 * 备案了 底部的备案信息
 * @author ChenGuangLong
 * @since 2024/4/16 14:58
*/
export default () => (
  <div className={'filing'}>
    <img src={'https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png'}
         alt={'备案图标'}
         style={{
           top: 2,
           right: 5,
           width: '16px',
           height: '16px',
           position: 'relative',
         }}
    />
    <a href="https://beian.mps.gov.cn/#/query/webSearch?code=44172102000170"
       rel="noreferrer"
       target="_blank"
    >
      粤公网安备44172102000170
    </a>
    <a type="link"
       href="https://beian.miit.gov.cn"
       target="_blank"
       style={{marginLeft: 20}}
    >
      粤ICP备2024164470号
    </a>
  </div>
)