import {Dropdown} from "antd";

/**
 * @param children 子元素
 * @param items {Array} 菜单项
 * @param tag {Object} 给回调函数的数据对象
 * @param lambdaObj {Object} 回调函数:键对应items的key属性 值对应回调函数 {string:function(tag)}
 * */
export default ({
                    children,
                    items=[{label: '编辑', key: 'EDIT'}, {label: '删除', key: 'DELETE'}],
                    tag,
                    lambdaObj
}) => {

    return (
        <Dropdown  // 右键菜单
            trigger={['contextMenu']}
            menu={{
                items,
                onClick: event => lambdaObj?.[event.key](tag)
            }}
            onContextMenu={e => e.preventDefault()}
        >
            {children}
        </Dropdown>
    )
}
