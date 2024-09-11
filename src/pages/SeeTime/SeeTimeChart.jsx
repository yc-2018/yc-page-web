import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Row, Space} from "antd";
import dayjs from "dayjs";
import {getSeeTime} from "../../request/otherRequest";
import {typeMapper, typeMapperEn} from "./mapper";
import DateUtils from "../../utils/DateUtils";
let sxIndex = 0;

let seeData = {
  seeRange: 1, // 1日、2周、3月、4年
  startDate: dayjs().startOf('day').valueOf(),
  endDate: dayjs().endOf('day').valueOf(),
};

let seeDataList = [];
// 一天的总毫秒数
const millisecondsInADay = 26 * 60 * 60 * 1000;
/**
 * 看时间图表
 *
 * @author Yc
 * @since 2024/9/11 0:41
 */
const SeeTimeChart = () => {
  const [, setSx] = useState(0);
  const sxYm = () => setSx(++sxIndex);

  useEffect(() => {
    getSeeData()
  }, [])

  const getSeeData = async () => {
    seeDataList = await getSeeTime(seeData);
    sxYm()
  }

  const builderBtn = type => {
    const changeSeeRange = type => {
      seeData.seeRange = type
      dateChange(dayjs())
      getSeeData()
    }

    return (
      <Button
        type="primary"
        size="large"
        style={{margin:'20px 0'}}
        disabled={seeData.seeRange === type}
        onClick={() => changeSeeRange(type)}
      >
        {typeMapper[type]}
      </Button>
    )
  }

  /**
   * 日期改变事件
   *
   * @author Yc
   * @since 2024/9/11 1:59
   */
  const dateChange = (date) => {
    let start = date.startOf(typeMapperEn[seeData.seeRange])
    let end = date.endOf(typeMapperEn[seeData.seeRange])
    if (seeData.seeRange === 2) {
      start = start.add(1, 'day')
      end = end.add(1, 'day')
    }
    seeData.startDate = start.valueOf();
    seeData.endDate = end.valueOf();
    sxYm()
    getSeeData()
  };


  return (
    <div style={{width:'99%',height:'100%',marginLeft:10}}>
      <div style={{display: 'flex', marginBottom: 10, height: 'calc(100vh - 130px)'}}>
        <div style={{width: 70, textAlign: 'center', background: '#f1ffeb', borderRadius: '10px 0 0 10px'}}>
          {builderBtn(1)} {/* 日 */}
          {builderBtn(2)} {/* 周 */}
          {builderBtn(3)} {/* 月 */}
          {builderBtn(4)} {/* 年 */}
        </div>


        <div
          style={{
            width: 'calc(100% - 70px)',
            background: '#fffff5',
            position: 'relative',
          }}
        >

          <div style={{position: 'absolute', top: 4, left: 8}}>
            {dayjs(seeData.startDate).format('YYYY-MM-DD')}
            {seeData.seeRange > 1 && ' ~ ' + dayjs(seeData.endDate).format('YYYY-MM-DD')}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              height: 'calc(100vh - 160px)',
              overflow: 'auto'}}
          >

            {seeDataList.map((item, index) =>
              <Row>
                <div
                  style={{
                    marginLeft:getFrontPercentage(item.startTime),
                    width: `${dayjs(item.endTime).diff(dayjs(item.startTime)) / millisecondsInADay * 100}%`,
                    background: '#ff8686',
                }}
                />
                {item.thisTime}
              </Row>)
            }
          </div>

          <Row>
            {Array.from({length: 26}).map((_, i) =>
              <div key={i} style={{width: `${100/26}%`, textAlign: 'center'}}>{i%24}</div>)}
          </Row>




        </div>
      </div>

      <Space size="large">
        <Button onClick={getSeeData}>刷新</Button>
        <DatePicker onChange={dateChange} picker={typeMapperEn[seeData.seeRange]}/>
        {seeDataList.length > 0 &&
          <b>
            总时长：
            {DateUtils.millisecondFormat(seeDataList.map(item => {
                const start = dayjs(item.startTime);
                const end = dayjs(item.endTime);
                return end.diff(start)
              }
            ).reduce((total, current) => total + current, 0))}
          </b>
        }

        {seeDataList.length > 0 &&
          <b>
            观看时长：
            {DateUtils.secondFormat(seeDataList.reduce((total, current) => total + current.thisTime, 0))}
          </b>
        }
      </Space>
    </div>
  );
};

export default SeeTimeChart;

function getFrontPercentage(dayjsTime) {
  // 获取当天开始时间 (00:00:00)
  const startOfDay = dayjs(dayjsTime).startOf('day');

  // 计算时间差，单位为毫秒
  const timeDifference = dayjs(dayjsTime).diff(startOfDay);


  // 计算时间差占一天的百分比
  const percentageOfDay = (timeDifference / millisecondsInADay) * 100;

  return `${percentageOfDay}%`;
}