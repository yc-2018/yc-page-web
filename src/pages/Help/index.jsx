import React from 'react';
import { Card, List } from 'antd';
const data = [
    {
        title: 'Title 1',
        content: 'Content 1'
    },
    {
        title: 'Title 2',
        content: 'Content 2'
    },
    {
        title: 'Title 3',
        content: 'Content 3'
    },
    {
        title: 'Title 4',
        content: 'Content 4'
    },
];
const Help = () => (
    <div>
        <h2>帮助页面</h2>
    <List
        grid={{gutter: 0, column: 4}/*间隙 ，列数*/}
        dataSource={data}
        renderItem={(item) => (
            <List.Item>
                <Card title={item.title}>{item.content}</Card>
            </List.Item>
        )}
    />
    </div>
);
export default Help;