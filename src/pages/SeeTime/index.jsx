import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {Result} from "antd";
import {saveSeeTime} from "../../request/otherRequest";

let requestData={}
let sxIndex = 0;
function SeeTime() {
  const [, setSx] = useState(0)
  const location = useLocation();
  let {startTime, endTime, duration, desc} = requestData;

  useEffect(()=>{
    const params = new URLSearchParams(location.search);
    if (!params.has('startTime') || !params.has('endTime') || !params.has('duration')) return;
    try {
      requestData.startTime = new Date(params.get('startTime'));  // 开始时间
      requestData.endTime = new Date(params.get('endTime'));      // 结束时间
      requestData.duration = Number(params.get('duration'));      // 当天总时长
      requestData.desc = params.get('desc');                      // 描述
      const isClose = Boolean(params.get('isClose'));    // 保存完直接就关闭页面
      initPage(isClose)
    } finally {
      sxYm()
    }
  },[])
  const sxYm = () => setSx(++sxIndex);

  const initPage =async (isClose) => {
    // 记录到本地
    let index = 1;
    while (true) {
      let item = window.localStorage.getItem(`seeTime${index}`);
      if (!item) {
        window.localStorage.setItem(`seeTime${index}`, JSON.stringify(requestData));
        break;
      }
      index++;
    }

    // 登录了？

    // 记录到云端
    let result = await saveSeeTime(requestData);
  };

  return (duration?
    <div style={{margin:8}}>
      <div>
        <h2>{desc}</h2>
        本次开始时间:{startTime}
        本次结束时间:{endTime}
        本次时长:{
        // 转日期时间类型后 结束时间-开始时间
        new Date(endTime).getTime() - new Date(startTime).getTime()

      }
        当天总时长:{duration}

      </div>



    </div>
      :
      <Result
        status="404"
        title="参数不全"
        subTitle="数据不足以支持渲染。"
      />
  );
}

export default SeeTime;