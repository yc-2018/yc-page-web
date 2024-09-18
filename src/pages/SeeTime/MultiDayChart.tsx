import {SeeData} from "./interface";
import React from "react";
import {aWeek, typeMapperCn} from "./mapper";
import dayjs from "dayjs";

interface MultiDayChartProps {
  seeDataList: SeeData[];
  seeDataConfig: { seeRange: number, startDate: number, endDate: number };
}

/**
 * 看时间 ｛周 月 年｝ 的图表
 *
 * @author Yc
 * @since 2024/9/18 23:41
 */
const MultiDay: React.FC<MultiDayChartProps> = ({seeDataList,seeDataConfig}) => {

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

  return (
    <div>
      <div style={{height: 'calc(-153px + 100vh)', display: 'flex'}}>
        {
          seeDataList.map(item =>
            <div key={item.date} style={{width: getWidthPercentage()}}>
              {item.date}
            </div>
          )
        }
      </div>
      {XAxis()}
    </div>
  )

}

export default MultiDay;