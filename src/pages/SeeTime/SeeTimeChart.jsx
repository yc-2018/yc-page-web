import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Space} from "antd";
import dayjs from "dayjs";
import {getSeeTime} from "../../request/otherRequest";
import {typeMapper, typeMapperEn} from "./mapper";
import OneDayChart, {OneDayBottomInfo} from "./OneDayChart";
import MultiDay, {MultiDayBottomInfo} from "./MultiDayChart";

let sxIndex = 0;

const DAY = 1;
const WEEK = 2;
const MONTH = 3;
const YEAR = 4;
const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';

let seeDataConfig = {
  seeRange: DAY, // 1日、2周、3月、4年
  startDate: dayjs().startOf('day').valueOf(),
  endDate: dayjs().endOf('day').valueOf(),
};

let seeDataList = [];
// 显示的小时的总毫秒数

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

  /** 参数时间戳变成秒级 */
  const getRequestParams = () => ({
    seeRange: seeDataConfig.seeRange,
    startDate: Math.floor(seeDataConfig.startDate / 1000),
    endDate: Math.floor(seeDataConfig.endDate / 1000),
  })

  /** 获取数据赋值到seeDataList */
  const getSeeData = async () =>
    sxYm(seeDataList = await getSeeTime(getRequestParams()));

  /** 构建看的范围按钮 */
  const builderBtn = type => {
    const changeSeeRange = type => {
      seeDataConfig.seeRange = type
      dateChange(dayjs())
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
   * @param date dayjs类型
   * @author Yc
   * @since 2024/9/11 1:59
   */
  const dateChange = (date) => {
    if (seeDataConfig.seeRange === WEEK && date.day() === 0) date = date.subtract(1, 'day') // 如果是周日会被认为是另外一个星期的开始导致星期拿错，所以减一天就对了
    let start = date.startOf(typeMapperEn[seeDataConfig.seeRange])
    let end = date.endOf(typeMapperEn[seeDataConfig.seeRange])
    if (seeDataConfig.seeRange === WEEK) {  // 周 默认周日开始，我这里设置为周一开始
      start = start.add(1, 'day')
      end = end.add(1, 'day')
    }
    seeDataConfig.startDate = start.valueOf();
    seeDataConfig.endDate = end.valueOf();
    sxYm()
    getSeeData()
  };

  const formatSeeRange = () => {
    switch (seeDataConfig.seeRange) {
      case DAY:
        return dayjs(seeDataConfig.startDate).format(dateFormat)
      case WEEK:
        return dayjs(seeDataConfig.startDate).format(weekFormat) + ' ~ ' + dayjs(seeDataConfig.endDate).format(weekFormat)
      case MONTH:
        return dayjs(seeDataConfig.startDate).format(monthFormat)
      case YEAR:
        return dayjs(seeDataConfig.startDate).format('YYYY')
      default :
        return undefined
    }
  }


  return (
    <div style={{width: '99%', height: '100%', marginLeft: 10}}>
      <div style={{display: 'flex', marginBottom: 10, height: 'calc(100vh - 130px)'}}>

        {/*——————————————————左边选择查看的区间按钮————————————————*/}
        <div style={{width: 70, textAlign: 'center', background: '#f1ffeb', borderRadius: '10px 0 0 10px'}}>
          {builderBtn(DAY)}
          {builderBtn(WEEK)}
          {builderBtn(MONTH)}
          {builderBtn(YEAR)}
        </div>

        {/*————————————————————图表展示内容——————————————————————*/}
        <div
          style={{
            width: 'calc(100% - 70px)',
            background: '#fffff5',
            position: 'relative',
            borderRadius: '0 10px 10px 0',
          }}
        >

          <b style={{position: 'absolute', top: 4, left: 8, color: '#999',fontSize:18}}>
            {dayjs(seeDataConfig.startDate).format('YYYY-MM-DD')}
            {seeDataConfig.seeRange !== DAY && ' ~ ' + dayjs(seeDataConfig.endDate).format('YYYY-MM-DD')}
          </b>

          {seeDataConfig.seeRange === DAY && <OneDayChart seeDataList={seeDataList}/>}
          {seeDataConfig.seeRange !== DAY && <MultiDay seeDataList={seeDataList} seeDataConfig={seeDataConfig}/>}

        </div>
      </div>

      {/*————————————————————————————底部功能————————————————————————————*/}
      <Space size="large">
        <Button onClick={getSeeData}>刷新</Button>
        <Button onClick={() => (seeDataConfig.seeRange = DAY) && dateChange(dayjs())}>今天</Button>
        <div>
          <Button
            onClick={() => dateChange(dayjs(seeDataConfig.startDate).subtract(1, typeMapperEn[seeDataConfig.seeRange]))}
            disabled={dayjs(seeDataConfig.startDate).isBefore(dayjs('2024-08-30'))}
          >
            上一{typeMapper[seeDataConfig.seeRange]}
          </Button>
          <DatePicker
            allowClear={false}
            onChange={dateChange}
            format={formatSeeRange}   // 设置显示的格式
            picker={typeMapperEn[seeDataConfig.seeRange]}
            value={dayjs(seeDataConfig.startDate)}
            minDate={dayjs('2024-08-30')}
            maxDate={dayjs()}
          />
          <Button
            onClick={() => dateChange(dayjs(seeDataConfig.endDate).add(1, typeMapperEn[seeDataConfig.seeRange]))}
            disabled={dayjs(seeDataConfig.endDate).isAfter(dayjs())}
          >
            下一{typeMapper[seeDataConfig.seeRange]}
          </Button>
        </div>

        {seeDataConfig.seeRange === DAY && < OneDayBottomInfo seeDataList={seeDataList}/>}
        {seeDataConfig.seeRange !== DAY && < MultiDayBottomInfo seeDataList={seeDataList}/>}

      </Space>
    </div>
  );
};

export default SeeTimeChart;

