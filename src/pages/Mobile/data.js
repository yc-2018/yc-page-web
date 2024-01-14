/**
 * 备忘列表左边操作
 * @param {Object} item 对象
 * @returns {Array}
 * */
export const leftActions = item => [
    {
        key: 'success',
        text: item.completed ? '取消完成' : '完成',
        color: item.completed ? '#895aa8' : 'success',
        id: item.id,
    },
    item.itemType === 1 ? {
        key: 'addOne',
        text: '+1',
        color: 'primary',
        id: item.id,
    } : undefined,
].filter(i => i);


export const rightActions = id => [
    {
        key: 'edit',
        text: '编辑',
        color: '#5f81c5',
        id,
    },
    {
        key: 'delete',
        text: '删除',
        color: 'danger',
        id,
    },
];