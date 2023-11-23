import {Button, Dropdown, Select, Space} from 'antd';


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
                <Button ghost type="dashed" size='small' href={"https://x.chatmindai.net/"}>ikun</Button>
            </Dropdown>

            <Dropdown
            dropdownRender={()=>
                <div>
                    <div><img src="https://x.chatmindai.net/Logo.png" width={10}/>自定义内容</div>
                    <div>自定义内容</div>
                    <div>自定义内容</div>
                    <div>自定义内容</div>
                </div>
              }
            >
                <Button ghost type="dashed" size='small' href={"https://ant-design.gitee.io/components/dropdown-cn"}>小黑子</Button>
            </Dropdown>

        </Space>
    )
}
