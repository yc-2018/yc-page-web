import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {Button, Card, Col, Empty, Result, Row} from "antd";
import {saveSeeTime} from "../../request/otherRequest";
import JWTUtils from "../../utils/JWTUtils";
import DateUtils from "../../utils/DateUtils";
import {observer} from "mobx-react-lite";
import MyEmpty from "../../compontets/common/MyEmpty";
import SeeTimeChart from "./SeeTimeChart";
import dayjs from "dayjs";
import {LeftOutlined} from "@ant-design/icons";

let sxIndex = 0;
let requestData = {}         // 读取URL参数组合
let localDataList = [];   // 本地记录列表
let lifeOpen = false;   // 是否打开左边的本地记录

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
      lifeOpen = true
      saveData()
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
  const saveData = async () => {
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
        if (itemObj.startTime?.toString() === requestData?.startTime?.toString()) {
          noExists = false;
          window.localStorage.setItem(`seeTime${index}`, JSON.stringify(requestData))
        }
        localDataList.unshift(itemObj);
      } else return noExists ? index : -1;
      index++;
    }
  }


  return (
    <div style={{margin: 12,display: 'flex'}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 88px)',
          width: lifeOpen ? '16%' : 0,
          transition: 'all 0.5s',
        }}
      >

        {lifeOpen &&
          <>
            <div style={{height: '22vh'}}>
              {duration ? <>
                  <h3>{remark}</h3>
                  <div><b>本次开始时间：</b>{DateUtils.format(startTime)}</div>
                  <div><b>本次结束时间：</b>{DateUtils.format(endTime)}</div>
                  <div><b>本次时长：</b>{DateUtils.millisecondFormat(endTime.getTime() - startTime.getTime())}</div>
                  <div><b>当天总时长：</b>{DateUtils.secondFormat(duration)}</div>
                </>
                :
                <Empty description="数据不足以支持渲染此处。" style={{marginTop: 12}}/>
              }
            </div>

            <div style={{background: 'rgba(240,240,240,0.29)', borderRadius: 6, flex: 1,overflow: 'auto'}}>
              <h3 style={{textAlign: 'center'}}>本地记录</h3>
              {localDataList.length > 0 ?
                <Row style={{padding: 6}}>
                  {localDataList.sort((a, b) => b.startTime - a.startTime).map(item =>
                    <Col span={24} key={item.startTime?.valueOf()} style={{marginBottom: 6}}>
                      <Card
                        styles={{body: {paddingTop: 12}}}
                        title={item.remark}>
                        <span>{dayjs(item.startTime).format('HH:mm:ss')}</span> {'>>>'}
                        <span>{dayjs(item.endTime).format('HH:mm:ss')}</span>
                        <div style={{display: "flex", flexWrap: 'wrap'}}>
                          <div>本次时长：</div>
                          <div>{DateUtils.millisecondFormat(item.endTime.getTime() - item.startTime.getTime())}</div>
                        </div>
                        <div style={{display: "flex", flexWrap: 'wrap'}}>
                          <div>当天总时长：</div>
                          <div>{DateUtils.secondFormat(item.duration)}</div>
                        </div>
                      </Card>
                    </Col>
                  )}
                </Row>
                :
                <Result
                  style={{padding: 0}}
                  status="404"
                  title="Empty"
                  subTitle="Sorry, 本地好像还没有记录哦."
                />
              }
            </div>
          </>
        }
      </div>

      {/*——————————漂浮开关左边按钮————————*/}
      <div style={{position: 'absolute', top: '50%', left: lifeOpen ? '16%' : 0, transition: 'all 0.5s'}}>
        <Button
          shape="circle"
          onClick={() => sxYm(lifeOpen = !lifeOpen)}
          icon={<LeftOutlined style={{transform: lifeOpen ? 'unset' : 'rotate(180deg)', transition: 'all 0.5s'}}/>}
        />
      </div>

      {/*————————————右边图表————————————*/}
      <div style={{width: lifeOpen ? '84%' : '100%'}}>
        {JWTUtils.isExpired()?
          <MyEmpty describe={'登录后方可查看观看时间数据~'}/>:
          <SeeTimeChart/>
        }
      </div>


    </div>

  );
}

export default observer(SeeTime);