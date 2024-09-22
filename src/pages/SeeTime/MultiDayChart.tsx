import {SeeData} from "./interface";
import React from "react";
import {Popover, Space} from "antd";
import dayjs from "dayjs";
import {aWeek, typeMapperCn} from "./mapper";
import MyEmpty from "../../compontets/common/MyEmpty";
import DateUtils from "../../utils/DateUtils";

interface MultiDayChartProps {
  seeDataList: SeeData[];
  seeDataConfig: { seeRange: number, startDate: number, endDate: number };
  onClick?: (dateStr: string) => void;
}

/**
 * 看时间 ｛周 月 年｝ 的图表
 *
 * @author Yc
 * @since 2024/9/18 23:41
 */
const MultiDay: React.FC<MultiDayChartProps> = ({seeDataList, seeDataConfig, onClick}) => {

  /** 不同的X轴生成 */
  const XAxis = () => {
    if (seeDataConfig.seeRange === typeMapperCn['周']) {
      return (
        <div style={{display: 'flex',textAlign: 'center'}}>
          {aWeek.map((item, index) =>
            <div key={item} style={{width: `${100 / 7}%`, background: index % 2 === 0 ? '#c4ffa9' : '#b9edff'}}>
              {item}
            </div>
          )}
        </div>
      )
    }
    if (seeDataConfig.seeRange === typeMapperCn['月']) {
      const daysInCurrentMonth = dayjs(seeDataConfig.startDate).daysInMonth();

      return (
        <div style={{display: 'flex', textAlign: 'center'}}>
          {new Array(daysInCurrentMonth).fill(0).map((_, index) =>
            <div
              key={index + seeDataConfig.startDate}
              style={{
                width: `${100 / daysInCurrentMonth}%`,
                background: index % 2 === 0 ? '#c4ffa9' : '#b9edff'
              }}
            >
              {index + 1}号
            </div>
          )}
        </div>
      )
    }
    if (seeDataConfig.seeRange === typeMapperCn['年']) {
      return (
        <div style={{display: 'flex', textAlign: 'center'}}>
          {new Array(12).fill(0).map((_, index) =>
            <div
              key={index + seeDataConfig.startDate}
              style={{
                width: `${100 / 12}%`,
                background: index % 2 === 0 ? '#c4ffa9' : '#b9edff'
              }}
           >
              {index + 1}月
           </div>
          )}
        </div>
      )
    }
    return <></>
  }

  /** 获取每条柱子宽度比例 */
  const getWidthPercentage = () => {
    if (seeDataConfig.seeRange === typeMapperCn['周']) return `${100 / 7}%`
    if (seeDataConfig.seeRange === typeMapperCn['月']) return `${100 / dayjs(seeDataConfig.startDate).daysInMonth()}%`
    return `${100 / 12}%`
  }

  /** 设置Y轴最高点 */
  const maxYAxis = (() => {
    const maxItem = seeDataList.reduce((max, item) => item.thisTime > max.thisTime ? item : max, seeDataList[0])
    if (maxItem) return maxItem.thisTime + maxItem.thisTime * 0.15
    return 0
  })()

  /** 日期补全 */
  const fillSeeDataList = () => {
    const {seeRange,startDate} = seeDataConfig;
    const fillList: SeeData[] = [];
    const howMany = seeRange === typeMapperCn['周'] ? 7 : seeRange === typeMapperCn['月'] ? dayjs(startDate).daysInMonth() : 12

    if(seeRange === typeMapperCn['年']){
      for (let i = 0; i < howMany; i++) {
        const dateStr = dayjs(startDate).add(i, 'month').format('YYYY-MM');
        const findSeeData = seeDataList.find(item => item.date === dateStr);
        if (findSeeData) fillList.push(findSeeData)
        else fillList.push({startTime: "", totalDuration: 0, date: dateStr, thisTime: 0, count: 0})
      }
      return fillList;
    }

    for (let i = 0; i < howMany; i++) {
      const dateStr = dayjs(startDate).add(i, 'day').format('YYYY-MM-DD');
      const findSeeData = seeDataList.find(item => item.date === dateStr);
      if (findSeeData) fillList.push(findSeeData)
      else fillList.push({startTime: "", totalDuration: 0, date: dateStr, thisTime: 0, count: 0})
    }
    return fillList;
  }


  return (
    <div>
      <div style={{height: 'calc(-153px + 100vh)', display: 'flex'}}>

        {seeDataList.length > 0 && fillSeeDataList().map(item =>
          <div key={item.date} style={{width: getWidthPercentage(), display: 'flex', alignItems: 'flex-end'}}>
            {item.thisTime !== 0 &&
              <Popover
                placement="right"
                content={
                  <div style={{fontSize: '14px', color: '#999'}}>
                    日期：{item.date}<br/>
                    时长：{DateUtils.secondFormat(item.thisTime)}<br/>
                    观看次数：{item.count}
                  </div>
                }
              >
                <div
                  style={{  // 柱子
                    width: '50%',
                    background: 'linear-gradient(180deg, #f1aaa6 0%, #c3b5f1 50%, #a0f1ef 100%)',
                    margin: '0 auto',
                    height: `${item.thisTime / maxYAxis * 100}%`,
                    borderRadius: '50% 0',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onClick={() => onClick && onClick(item.date as string)}
                >
                  <div  // 柱子上面 显示时长
                    style={{
                      position: 'absolute',
                      bottom: '101%',
                      left: '-50%',
                      width: '200%',
                      textAlign: 'center',
                      color: '#999',
                    }}
                  >
                    {DateUtils.secondFormat(item.thisTime)}
                  </div>
                </div>
              </Popover>
            }
          </div>
        )}
      </div>
      {(seeDataList.length === 0 || maxYAxis === 0) &&
        <MyEmpty describe={'您选择的时间段没有观看时间数据哦,真棒!'} style={{width: '40vw', margin: ' 0 auto'}}/>
      }
      {XAxis()}
    </div>
  )
}

export default MultiDay;

/**
 * 显示底部统计信息
 *
 * @author Yc
 * @since 2024/9/22 2:38
 */
export const MultiDayBottomInfo: React.FC<{ seeDataList: SeeData[] }> = ({seeDataList = []}) =>
  seeDataList.length > 0 ?
    <Space size="large">
      <b>
        总观看时长：
        {DateUtils.secondFormat(seeDataList.map(item => item.thisTime).reduce((total, current) => total + current, 0))}
      </b>
      <b>
        总观看次数：
        {seeDataList.reduce((total, current) => total + (current.count ?? 0), 0)}
      </b>
    </Space> : <></>