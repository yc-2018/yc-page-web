import {Button, Dropdown, Space} from 'antd';


export default function Bookmarks() {
    const items = [
        {
            key: '1',
            label: (
                <a target="_blank"  href="https://ant-design.gitee.io/components/dropdown-cn">
                    下拉菜单 Dropdown - Ant Design
                </a>
            ),
            icon: <img src="https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png" width={10}/>,
        },
        {
            key: '2',
            label: (
                <a target="_blank" href="https://www.aliyun.com">
                    2nd menu item (disabled)
                </a>
            ),
            icon: <img src="https://g.csdnimg.cn/static/logo/favicon32.ico" width={10}/>,
        },
        {
            key: '3',
            label: (
                <a target="_blank"  href="https://x.chatmindai.net/">
                    gpt一年
                </a>
            ),
            icon: <img src="https://x.chatmindai.net/Logo.png" width={10}/>,
        },
        {
            key: '4',
            label: 'a danger item',
            icon: <img src="https://x.chatmindai.net/Logo.png" width={10}/>,
        },
        

        
    ];

    return (
        <Space>

            <Dropdown menu={{items,}} >
                <Button ghost type="dashed" size='small'>ikun</Button>
            </Dropdown>

            <Dropdown menu={{items}}>
                <a /* onClick={(e) => e.preventDefault()} */ href='http://8.134.201.95/'>
                    Hover me
                </a>
            </Dropdown>

        </Space>
    )
}
