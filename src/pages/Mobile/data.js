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

export const columns = [
    {label: '未完成', value: 0},
    {label: '完成', value: 1},
    {label: '全部', value: -1}]
export const finishName =(column)=> columns.find(i => i.value === column).label
export const orderByName =(column)=> sortingOptions.find(i => i.value === column).label

/*列表随机返回一张欢迎图*/
export const getWelcomePic = () => {
    const welcomePicList = [
        // 'https://i.niupic.com/images/2024/01/18/fqoW.png',
        '21/4ov5.512X512-1',
        '21/dIpc.1536X1024-2',
        '21/lgpi.512X512-3',
        '21/vaXU.512X512-4',
        '21/yGvo.1024X1024-5',
        '21/lWy2.1024X1024-6',
        '21/drWX.1024X1024-7',
        '21/rKFv.1024X1024-8',
        '21/E3n4.1024X1024-9',
        '21/hkNt.1024X1024-10',
        '21/EoIz.1024X1024-11',
        '21/gp87.1024X1024-12',
        '22/I4FN.1024X1024-13',
        '22/1FKs.1024X1024-14',
        '22/oMA8.512X512-15',
        '22/gPqD.1024X1024-16',
        '22/J7XD.1024X1024-17',
        '22/JCoe.1024X1024-18',
        '22/xwD3.1024X1024-19',
        '22/yhzY.1024X1024-20',
        '22/NPza.1024X1024-21',
        '22/5CSq.1024X1024-22',
        '22/5L9J.1024X1024-23',
        '22/yiqk.1024X1024-24',
        '22/zgkB.1024X1024-25',
        '22/Rt7b.1024X1024-26',
    ]
    return `https://z.wiki/autoupload/202404${welcomePicList[Math.floor(Math.random() * welcomePicList.length)]}.jpg`
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