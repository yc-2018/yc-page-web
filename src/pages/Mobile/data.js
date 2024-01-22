import {sortingOptions} from "../../store/NoLoginData";
import {BookOutlined, UnorderedListOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";

/**
 * 备忘列表左边操作
 * @param {Object} item 对象
 * @returns {Array}
 * */
export const leftActions = item => [
    item.itemType === 1 && {
        key: 'addOne',
        text: '+1',
        color: 'primary',
        id: item.id,
    },
    {
        key: 'success',
        text: item.completed ? '取消完成' : '完成',
        color: item.completed ? '#895aa8' : 'success',
        id: item.id,
    },

].filter(i => i);


export const rightActions = item => [
    item.completed === 0 && {
        key: 'edit',
        text: '编辑',
        color: '#5f81c5',
        id: item.id,
    },
    {
        key: 'delete',
        text: '删除',
        color: 'danger',
        id: item.id,
        completed: item.completed
    },
].filter(i => i);

export const columns =[[
    { label: '未完成', value: 0 },
    { label: '完成', value: 1 },
    { label: '全部', value: -1 }],sortingOptions]
export const finishName =(column)=> columns[0].find(i => i.value === column).label
export const orderByName =(column)=> columns[1].find(i => i.value === column).label

/*列表随机返回一张欢迎图*/
export const getWelcomePic = () => {
    const welcomePicList = [
        'https://i.niupic.com/images/2024/01/18/fq2S.png',
        'https://i.niupic.com/images/2024/01/18/fq1O.png',
        'https://i.niupic.com/images/2024/01/18/fqnk.png',
        'https://i.niupic.com/images/2024/01/18/fqnu.png',
        'https://i.niupic.com/images/2024/01/18/fqnB.png',
        'https://i.niupic.com/images/2024/01/18/fqnK.png',
        'https://i.niupic.com/images/2024/01/18/fqnP.png',
        'https://i.niupic.com/images/2024/01/18/fqnV.png',
        'https://i.niupic.com/images/2024/01/18/fqo3.png',
        'https://i.niupic.com/images/2024/01/18/fqo9.png',
        'https://i.niupic.com/images/2024/01/18/fqog.png',
        'https://i.niupic.com/images/2024/01/18/fqoo.png',
        'https://i.niupic.com/images/2024/01/18/fqoP.png',
        'https://i.niupic.com/images/2024/01/18/fqoW.png',
    ]
    return welcomePicList[Math.floor(Math.random() * welcomePicList.length)]
}

/*底部导航*/
export const tabs = [
    {
        key: 'Memos',
        title: '待办',
        icon: <UnorderedListOutlined />,
    },
    {
        key: 'Blog',
        title: '博客',
        icon: <BookOutlined />,
    },
    {
        key:'Me',
        title: '我的',
        icon: <UserOutlined />,
    },
]


export const loginTime = [
    {
        label: '半天',
        value: 'bt',
    },
    {
        label: '一天',
        value: 'yt',
    },
    {
        label: '一周',
        value: 'yz',
    },
    {
        label: '一月',
        value: 'yy',
    },
    {
        label: '一年',
        value: 'yn',
    },
]