import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {Col, Empty, Result, Row} from "antd";
import {saveSeeTime} from "../../request/otherRequest";
import JWTUtils from "../../utils/JWTUtils";
import DateUtils from "../../utils/DateUtils";

let sxIndex = 0;
let requestData = {}         // 读取URL参数组合
let localDataList = [];   // 本地记录列表

function SeeTime() {
  const [, setSx] = useState(0)
  const location = useLocation();
  let {startTime, endTime, duration, remark} = requestData;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.has('startTime') || !params.has('endTime') || !params.has('duration')) return sxYm(readData());
    try {
      requestData.startTime = DateUtils.timestampToDate(params.get('startTime'));  // 开始时间
      requestData.endTime = DateUtils.timestampToDate(params.get('endTime'));      // 结束时间
      requestData.duration = parseInt(params.get('duration'));                     // 当天总时长
      requestData.remark = params.get('remark');                                   // 描述
      const isClose = Boolean(params.get('isClose'));                     // 保存完直接就关闭页面
      saveData(isClose)
    } finally {
      sxYm()
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
    if (index === -1) return;

    window.localStorage.setItem(`seeTime${index}`, JSON.stringify(requestData));

    // 登录了？
    if (!JWTUtils.isExpired()) {
      // 记录到云端
      let result = await saveSeeTime({
        ...requestData,
        startTime: requestData.startTime.valueOf(),
        endTime: requestData.endTime.valueOf()
      });
      if (result) {
        requestData.save = 1;
        window.localStorage.setItem(`seeTime${index}`, JSON.stringify(requestData));
      }
    }
    if (isClose) window.close();

  };

  /**
   * 读取本地看时间数据
   * @return {number} 本地最后一个没到的数据的索引,但是如果URL有数据而且和本地数据开始时间一样，则返回-1
   * @author Yc
   * @since 2024/8/27 2:30
   */
  const readData = () => {
    localDataList = [];             // 本地记录列表
    let index = 1;         //  哪个索引存储现在的数据
    let noExists = true;  //  本地数据不存在
    while (true) {
      let item = window.localStorage.getItem(`seeTime${index}`);
      if (item) {
        const itemObj = JSON.parse(item);
        itemObj.startTime = new Date(itemObj.startTime)
        itemObj.endTime = new Date(itemObj.endTime)
        // 如果url有值 和URL比较，系统就覆盖
        if (itemObj.startTime.toString() === requestData?.startTime.toString()) {
          noExists = false;
          window.localStorage.setItem(`seeTime${index}`, JSON.stringify(requestData))
        }
        localDataList.unshift(itemObj);
      } else return noExists ? index : -1;
      index++;
    }
  }


  return (
    <Row style={{margin: 12}}>
      <Col span={10} style={{display: 'flex', flexDirection: 'column', height: 'calc(100vh - 88px)'}}>
        <div style={{height: '22vh'}}>
          {duration ? <>
              <h2>{remark}</h2>
              本次开始时间:{DateUtils.format(startTime)}
              本次结束时间:{DateUtils.format(endTime)}
              本次时长:{endTime.getTime() - startTime.getTime()}
              当天总时长:{duration}
            </>
            :
            <Empty description="数据不足以支持渲染此处。" style={{marginTop:12}}/>}
        </div>

        <div style={{textAlign: 'center', background: 'rgba(240,240,240,0.29)', borderRadius: 6, flex: 1}}>
          <h3>本地记录</h3>
          {localDataList.length > 0 ?
            <div>
              {localDataList.map(item =>
                <div key={item.startTime?.valueOf()}>
                  {item.remark}
                  {item.save ? '已保存' : '未保存'}
                </div>
              )}
            </div>
            :
            <Result
              style={{padding: 0}}
              status="404"
              title="Empty"
              subTitle="Sorry, 本地好像还没有记录哦."
            />
          }

        </div>
      </Col>

      <Col span={14}>
        登录后网络数据
      </Col>


    </Row>

  );
}

export default SeeTime;