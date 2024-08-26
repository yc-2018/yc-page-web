import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {Col, Empty, Row} from "antd";
import {saveSeeTime} from "../../request/otherRequest";
import JWTUtils from "../../utils/JWTUtils";

let sxIndex = 0;
let requestData = {}         // 读取URL参数组合
let localDataList = [];   // 本地记录列表

function SeeTime() {
  const [, setSx] = useState(0)
  const location = useLocation();
  let {startTime, endTime, duration, desc} = requestData;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.has('startTime') || !params.has('endTime') || !params.has('duration')) return sxYm(readData());
    try {
      requestData.startTime = new Date(params.get('startTime'));  // 开始时间
      requestData.endTime = new Date(params.get('endTime'));      // 结束时间
      requestData.duration = Number(params.get('duration'));      // 当天总时长
      requestData.desc = params.get('desc');                      // 描述
      const isClose = Boolean(params.get('isClose'));    // 保存完直接就关闭页面
      saveData(isClose)
    } finally {

    }
  }, [])
  const sxYm = () => setSx(++sxIndex);

  /**
   * 保存看时间数据到服务器
   *
   * @author Yc
   * @since 2024/8/27 2:37
   */
  const saveData = async (isClose) => {
    // 记录到本地
    let index = readData();
    window.localStorage.setItem(`seeTime${index}`, JSON.stringify(requestData));

    // 登录了？
    if (!JWTUtils.isExpired()) {
      // 记录到云端
      let result = await saveSeeTime(requestData);
      if (result) {
        requestData.save = 1;
        window.localStorage.setItem(`seeTime${index}`, JSON.stringify(requestData));
      }
    }
    if (isClose) window.close();


  };

  /**
   * 读取本地看时间数据
   * @return {number} 本地最后一个没到的数据的索引
   * @author Yc
   * @since 2024/8/27 2:30
   */
  const readData = () => {
    localDataList = [];       // 本地记录列表
    let index = 1;   //  哪个索引存储现在的数据
    while (true) {
      let item = window.localStorage.getItem(`seeTime${index}`);
      item && localDataList.unshift(JSON.parse(item))
      if (!item) return index;
      index++;
    }
  }



  return (
    <Row style={{margin: 12}}>
      <Col span={10}>
        <div style={{height:'22vh'}}>
          {duration ? <>
              <h2>{desc}</h2>
              本次开始时间:{startTime}
              本次结束时间:{endTime}
              本次时长:{new Date(endTime).getTime() - new Date(startTime).getTime()}
              当天总时长:{duration}
            </>
            :
            <Empty description="数据不足以支持渲染此次." />}
        </div>

        <div style={{textAlign: 'center', background: 'rgba(240,240,240,0.29)', borderRadius: 6}}>
          <h3>本地记录</h3>

        </div>
      </Col>

      <Col span={14}>
        登录后网络数据
      </Col>


    </Row>

  );
}

export default SeeTime;