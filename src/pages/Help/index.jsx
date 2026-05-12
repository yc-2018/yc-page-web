import React from 'react';
import {Col, Row} from 'antd';

const data = [      // 超过一个就会报错：Uncaught SyntaxError: Identifier 'u' has already been declared
    {
        title: 'Open备忘第一页 备忘介绍',
        content: 'aid=1550258784&bvid=BV15y421Y7KW&cid=1431193521'
    },
    {
        title: 'Open备忘第一页 页面配置介绍',
        content: 'aid=1200458240&bvid=BV1MF4m1M7qJ&cid=1431142000'
    },
    {
        title: 'Open备忘第一页 搜索功能介绍',
        content: 'aid=1300073102&bvid=BV1GT4m1S7Kx&cid=1429151385'
    },
];
export default () => (
    <>
        <h2>帮助页面</h2>
        <Row>
            {data.map(({title, content}) =>
                <Col span={8} key={title}>
                    <div style={{
                        boxShadow: 'rgb(153 153 153 / 50%) 0px 0px 10px inset',
                        borderRadius: 4,
                        padding: 5,
                        margin: '0 5px'
                    }}>
                        <div style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>{title}</div>
                        <iframe height={300} width={'100%'}
                                src={`//player.bilibili.com/player.html?${content}&p=1&autoplay=0`} // bilibili内嵌默认自动播放 手动加入 &autoplay=0 默认不播放
                                allowFullScreen={true}
                        />
                    </div>
                </Col>
            )}
        </Row>
    </>
)
