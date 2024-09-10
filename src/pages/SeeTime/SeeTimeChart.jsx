import React, {useEffect, useState} from 'react';
import {Button, Col, DatePicker, Row, Space} from "antd";
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
            display: 'flex',
            flexDirection: 'column-reverse',
            position: 'relative',
          }}
        >
          <div style={{position: 'absolute', top: 0, left: 0}}>
            {dayjs(seeData.startDate).format('YYYY-MM-DD')}
            {seeData.seeRange > 1 && ' ~ ' + dayjs(seeData.endDate).format('YYYY-MM-DD')}
          </div>

          <Row>
            {Array.from({length: 24}).map((_, i) => <Col span={1} key={i} style={{textAlign: 'center'}}>{i}</Col>)}
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