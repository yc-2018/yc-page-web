import {Popover, Row, Space} from "antd";
import dayjs from "dayjs";
import React from "react";
import DateUtils from "../../utils/DateUtils";
import {SeeData} from "./interface";
import MyEmpty from "@/components/common/MyEmpty";

let seeTimeRange: number[] = [];  // 显示的时间范围

interface OneDayChartProps {
  seeDataList: SeeData[];
}

/**
 * 专门显示一天的图表
 *
 * @author Yc
 * @since 2024/9/14 1:46
 */
const OneDayChart: React.FC<OneDayChartProps> = ({seeDataList}) => {
  /** 返回和X个小时的毫秒数 */
  const millisecondsInHour = () => seeTimeRange.length * 60 * 60 * 1000;
  /** 计算本次的百分比 */
  const percentageThisTime = (item: SeeData) =>
    `${dayjs(item.endTime).diff(dayjs(item.startTime)) / millisecondsInHour() * 100}%`
  /** 本次打开时间和观看时间差异百分百 */
  const diffPercentage = (item: SeeData): string => {
    const openTime = dayjs(item.endTime).diff(dayjs(item.startTime));
    const watchTime = item.thisTime * 1000;
    return `${watchTime / openTime * 100}%`
  }

  /** 不同类型不同颜色的线 */
  const lineStyles = (item: SeeData, outIn: '外' | '内') => {
    const Colors: any = {
      '抖音刷视频外': '#c5daff',
      '抖音刷视频内': '#92b8fa',
      '抖音用户页外': '#fce1ce',
      '抖音用户页内': '#fcc5a3',
      '抖音搜索页外': '#fccedd',
      '抖音搜索页内': '#ffabc6',
    }

    return {
      background: Colors[`${item.remark}${outIn}`] || (outIn === '外' ? '#e1e1e1' : '#c0c0c0'),
      width: outIn === '外' ? percentageThisTime(item) : diffPercentage(item),
      height: 25,
      borderRadius: 5,
      margin: outIn === '外' ? '5px 0' : 'unset'
    }

  }

  /** 计算画图前 前面应该空多少 */
  const getFrontPercentage = (dayjsTime: string) => {
    const startOfHour = dayjs(seeDataList[0].startTime).startOf('day');

    const hourIndex = seeTimeRange.indexOf(dayjs(dayjsTime).hour())
    const virtualHour = dayjs(dayjsTime).hour(hourIndex)

    // 计算时间差，单位为毫秒
    const timeDifference = virtualHour.diff(startOfHour);

    // 计算时间差占一天的百分比
    const percentageOfDay = (timeDifference / millisecondsInHour()) * 100;

    return `${percentageOfDay}%`;
  }

  /**
   * 把有看的时间小时范围记录，没有的一个连续两个小时的就合并为... 如果开始天和结束天不是同一天那就一直加到结束时间的小时数，如 23，0，1
   *
   * @author Yc
   * @since 2024/9/13 1:54
   */
  const setSeeTimeRange = () => {
    seeTimeRange = []

    if (seeDataList.length === 0) return;

    // 把看过的小时放入数组
    for (let i = 0; i < seeDataList.length; i++) {
      const item = seeDataList[i];
      let startHour = dayjs(item.startTime).hour();
      let endHour = dayjs(item.endTime).hour();
      const hourDiff = endHour - startHour;

      if (hourDiff < 0) endHour = 23;  // 跨天也就执行到23点
      for (let j = startHour; j <= endHour; j++) !seeTimeRange.includes(j) && seeTimeRange.push(j);
    }
    // 从小到大排序
    seeTimeRange.sort((a: number, b: number) => a - b);

    // 加上 {h} 或...(-1)
    const newSeeTimeRange = [seeTimeRange[0]]
    for (let i = 1; i < seeTimeRange.length; i++) {
      const diff = seeTimeRange[i] - seeTimeRange[i - 1];
      if (diff === 2) newSeeTimeRange.push(seeTimeRange[i - 1] + 1)
      if (diff > 2) newSeeTimeRange.push(-1)
      newSeeTimeRange.push(seeTimeRange[i])
    }

    // 这天看的最后一个小时
    const oneDayLastHour = seeTimeRange[seeTimeRange.length - 1];
    newSeeTimeRange.push((oneDayLastHour + 1) % 24)                             // 多给一个小时 防止展示超标
    if (oneDayLastHour === 23) newSeeTimeRange.push((oneDayLastHour + 2) % 24)  // 跨天就再多给一个小时 防止展示超标

    seeTimeRange = newSeeTimeRange;
  };
  setSeeTimeRange();  // 直接执行

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          height: 'calc(-153px + 100vh)',
          overflow: 'auto'
        }}
      >

        {/*————————循环渲染 看时间的每一项——————*/}
        {seeDataList.filter(item => item.startTime).map((item: SeeData) =>
          <Row key={item.startTime}>
            <div style={{marginLeft: getFrontPercentage(item.startTime)}}/>
            <Popover
              placement="top"
              content={
              <div style={{textAlign:"center"}}>
                <b style={{color: '#646464',fontSize: 18}}>{item.remark}</b><br/>
                <b>{dayjs(item.startTime).format('HH:mm:ss')} ~ {dayjs(item.endTime).format('HH:mm:ss')}</b>
                <div>打开时间：{DateUtils.millisecondFormat(dayjs(item.endTime).diff(dayjs(item.startTime)))}</div>
                <div>观看时间：{DateUtils.secondFormat(item.thisTime)}</div>
                <div>至此已览：{DateUtils.secondFormat(item.totalDuration)}</div>
              </div>
            }
            >
              <div style={lineStyles(item, '外')}>
                <div style={lineStyles(item, '内')}/>
              </div>
            </Popover>
            <span style={{lineHeight: '34px', marginLeft: 3, color: '#999'}}>
              {DateUtils.millisecondFormat(dayjs(item.endTime).diff(dayjs(item.startTime)))}
            </span>
          </Row>)
        }
        {seeDataList.length === 0 &&
          <MyEmpty describe={'这天没有观看时间数据哦,真棒!'} style={{width: '40vw', margin: ' 0 auto'}}/>
        }
      </div>

      {/*——————————X轴时间轴——————————*/}
      <Row>
        {seeTimeRange.map((hour: number , index: number) =>
          <div
            key={index}
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              width: `${100 / seeTimeRange.length}%`,
              background: index % 2 === 0 ? '#c4ffa9' : '#b9edff'
            }}
          >
            {hour === -1 ? '...' : `${hour}`}
          </div>
        )}
      </Row>
    </>)
}
export default OneDayChart


/**
 * 显示底部统计信息
 *
 * @author Yc
 * @since 2024/9/14 1:14
 */
export const OneDayBottomInfo: React.FC<OneDayChartProps> = ({seeDataList = []}) =>
  seeDataList.length > 0 ?
    <Space size="large">
      <b>
        总时长：
        {DateUtils.millisecondFormat(seeDataList.map(item => {
            const start = dayjs(item.startTime);
            const end = dayjs(item.endTime);
            return end.diff(start)
          }
        ).reduce((total, current) => total + current, 0))}
      </b>
      <b>
        观看时长：
        {DateUtils.secondFormat(seeDataList.reduce((total, current) => total + current.thisTime, 0))}
      </b>
      <b>共看了 <span style={{color: '#ff0000'}}>{seeDataList.length}</span> 次</b>
    </Space> : <></>


