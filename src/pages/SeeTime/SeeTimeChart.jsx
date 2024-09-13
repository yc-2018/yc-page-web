import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Row, Space} from "antd";
import dayjs from "dayjs";
import {getSeeTime} from "../../request/otherRequest";
import {typeMapper, typeMapperEn} from "./mapper";
import DateUtils from "../../utils/DateUtils";
let sxIndex = 0;

let seeDataConfig = {
  seeRange: 1, // 1日、2周、3月、4年
  startDate: dayjs().startOf('day').valueOf(),
  endDate: dayjs().endOf('day').valueOf(),
};

let seeDataList = [];
let seeTimeRange = [];  // 显示的时间范围
// 显示的小时的总毫秒数
const millisecondsInHour = () => seeTimeRange.length * 60 * 60 * 1000;
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
    seeDataList = await getSeeTime(seeDataConfig);
    setSeeTimeRange();
    sxYm();
  }

  /**
   * 把有看的时间小时范围记录，没有的一个连续两个小时的就合并为... 如果开始天和结束天不是同一天那就一直加到结束时间的小时数，如 23，0，1
   *
   * @author Yc
   * @since 2024/9/13 1:54
   */
  const setSeeTimeRange = () => {
    seeTimeRange = []
    let crossDayHour = false; // 是否跨越天

    // 把看过的小时放入数组
    for (let i = 0; i < seeDataList.length; i++) {
      const item = seeDataList[i];
      let startHour = dayjs(item.startTime).hour();
      let endHour = dayjs(item.endTime).hour();
      const hourDiff = endHour - startHour;
      if (hourDiff < 0) {
        crossDayHour = true;
        endHour = 23
      }
      for (let j = startHour; j <= endHour; j++) !seeTimeRange.includes(j) && seeTimeRange.push(j);
    }
    // 从小到大排序
    seeTimeRange.sort((a, b) => a - b);

    // 加上 {h} 或...
    const newSeeTimeRange = [seeTimeRange[0]]
    for (let i = 1; i < seeTimeRange.length; i++) {
      const diff = seeTimeRange[i] - seeTimeRange[i - 1];
      if (diff === 2) newSeeTimeRange.push(seeTimeRange[i - 1] + 1)
      if (diff > 2) newSeeTimeRange.push('...')
      newSeeTimeRange.push(seeTimeRange[i])
    }

    // 只要隔天了就加上两小时
    if (crossDayHour) {
      newSeeTimeRange.push(0)
      newSeeTimeRange.push(1)
    }
    if (!crossDayHour) newSeeTimeRange.push(seeTimeRange[seeTimeRange.length - 1] + 1)

    seeTimeRange = newSeeTimeRange;
  };


  const builderBtn = type => {
    const changeSeeRange = type => {
      seeDataConfig.seeRange = type
      dateChange(dayjs())
      getSeeData()
    }

    return (
      <Button
        type="primary"
        size="large"
        style={{margin:'20px 0'}}
        disabled={seeDataConfig.seeRange === type}
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
    let start = date.startOf(typeMapperEn[seeDataConfig.seeRange])
    let end = date.endOf(typeMapperEn[seeDataConfig.seeRange])
    if (seeDataConfig.seeRange === 2) {
      start = start.add(1, 'day')
      end = end.add(1, 'day')
    }
    seeDataConfig.startDate = start.valueOf();
    seeDataConfig.endDate = end.valueOf();
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
            {dayjs(seeDataConfig.startDate).format('YYYY-MM-DD')}
            {seeDataConfig.seeRange > 1 && ' ~ ' + dayjs(seeDataConfig.endDate).format('YYYY-MM-DD')}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              height: 'calc(100vh - 160px)',
              overflow: 'auto'}}
          >

            {seeDataList.map(item =>
              <Row key={item.id}>
                <div
                  style={{
                    marginLeft:getFrontPercentage(item.startTime),
                    width: `${dayjs(item.endTime).diff(dayjs(item.startTime)) / millisecondsInHour() * 100}%`,
                    background: '#ff8686',
                }}
                />
                {dayjs(item.startTime).format('HH:mm:ss')} ~
                {dayjs(item.endTime).format('HH:mm:ss')} /
                {item.thisTime}
              </Row>)
            }
          </div>

          {/*——————————X轴时间轴——————————*/}
          <Row>
            {seeTimeRange.map((hour, index) =>
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  width: `${100 / seeTimeRange.length}%`,
                  background: index % 2 === 0 ? '#c4ffa9' : '#b9edff'
              }}
              >
                {hour}
              </div>
            )}
          </Row>




        </div>
      </div>

      <Space size="large">
        <Button onClick={getSeeData}>刷新</Button>
        <DatePicker onChange={dateChange} picker={typeMapperEn[seeDataConfig.seeRange]}/>
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
  const startOfHour = dayjs(seeDataList[0].startTime).startOf('day');

  const hourIndex = seeTimeRange.indexOf(dayjs(dayjsTime).hour())
  const virtualHour = dayjs(dayjsTime).hour(hourIndex)

  // 计算时间差，单位为毫秒
  const timeDifference = virtualHour.diff(startOfHour);

  // 计算时间差占一天的百分比
  const percentageOfDay = (timeDifference / millisecondsInHour()) * 100;

  return `${percentageOfDay}%`;
}