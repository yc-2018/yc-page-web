import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Space} from "antd";
import dayjs from "dayjs";
import {getSeeTime} from "../../request/otherRequest";
import {typeMapper, typeMapperEn} from "./mapper";
import OneDayChart, {OneDayTotalDuration, OneDayWatchDuration} from "./OneDayChart";
let sxIndex = 0;

let seeDataConfig = {
  seeRange: 1, // 1日、2周、3月、4年
  startDate: dayjs().startOf('day').valueOf(),
  endDate: dayjs().endOf('day').valueOf(),
};
const DAY = 1;
const WEEK = 2;
const MONTH = 3;
const YEAR = 4;

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

  const getSeeData = async () => sxYm(seeDataList = await getSeeTime(seeDataConfig));

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
    if (seeDataConfig.seeRange === WEEK) {  // 周 默认周日开始，我这里设置为周一开始
      start = start.add(1, 'day')
      end = end.add(1, 'day')
    }
    seeDataConfig.startDate = start.valueOf();
    seeDataConfig.endDate = end.valueOf();
    sxYm()
    getSeeData()
  };


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
          }}
        >

          <b style={{position: 'absolute', top: 4, left: 8, color: '#999',fontSize:18}}>
            {dayjs(seeDataConfig.startDate).format('YYYY-MM-DD')}
            {seeDataConfig.seeRange !== DAY && ' ~ ' + dayjs(seeDataConfig.endDate).format('YYYY-MM-DD')}
          </b>

          {seeDataConfig.seeRange === DAY && <OneDayChart seeDataList={seeDataList}/>}

        </div>
      </div>

      {/*————————————————————————————底部功能————————————————————————————*/}
      <Space size="large">
        <Button onClick={getSeeData}>刷新</Button>
        <DatePicker onChange={dateChange} picker={typeMapperEn[seeDataConfig.seeRange]} allowClear={false}/>
        {seeDataConfig.seeRange === DAY && < OneDayTotalDuration seeDataList={seeDataList}/>}
        {seeDataConfig.seeRange === DAY && <OneDayWatchDuration seeDataList={seeDataList}/>}
        <b>共看了 <span style={{color: '#ff0000'}}>{seeDataList.length}</span> 次</b>
      </Space>
    </div>
  );
};

export default SeeTimeChart;

