import { Button, Dropdown, Space } from 'antd';


export default function Bookmarks({ messageApi }) {
    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" href="https://ant-design.gitee.io/components/dropdown-cn">
                    下拉菜单 Dropdown - Ant Design
                </a>
            ),
            icon: <img src="https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png" width={10} />,
        },
        {
            key: '2',
            label: (
                <a target="_blank" href="https://www.aliyun.com">
                    2nd menu item (disabled)
                </a>
            ),
            icon: <img src="https://g.csdnimg.cn/static/logo/favicon32.ico" width={10} />,
        },
        {
            key: '3',
            label: (
                <a target="_blank" href="https://x.chatmindai.net/">
                    gpt一年
                </a>
            ),
            icon: <img src="https://x.chatmindai.net/Logo.png" width={10} />,
        },
        {
            key: '4',
            label: 'a danger item',
            icon: <img src="https://x.chatmindai.net/Logo.png" width={10} />,
        },



    ];

    return (
        <Space>

            <Dropdown menu={{ items, }} >
                <Button ghost type="dashed" size='small' href={"https://x.chatmindai.net/"}>ikun</Button>
            </Dropdown>

            <Dropdown
                dropdownRender={() =>
                    <div>
                        <div><img src="https://x.chatmindai.net/Logo.png" width={10} />自定义内容</div>
                        <div>自定义内容</div>
                        <div>自定义内容</div>
                        <div>自定义内容</div>
                    </div>
                }
            >
                <Button ghost type="dashed" size='small' href={"https://ant-design.gitee.io/components/dropdown-cn"}>小黑子</Button>
            </Dropdown>


            <Dropdown onClick={() => { messageApi.info('微信和电脑是没有反应的,【要手机浏览器打开哇】') }}
                dropdownRender={() =>
                    <img src="https://x.chatmindai.net/Logo.png" width={50} />
                }
            >
                <Button ghost type="dashed" size='small' href={"dingtalk://dingtalkclient/page/link?url=http://m.hrm.timeexpress.com.cn/M_OrderDinner/QrCode"}>
                    吃饭码
                </Button>
            </Dropdown>


            <Dropdown dropdownRender={() => <div />} onClick={() => { messageApi.info('微信和电脑是没有反应的,【要手机浏览器打开哇】') }}>
                <a href='dingtalk://dingtalkclient/page/link?url=http://m.hrm.timeexpress.com.cn/M_OrderDinner'>约饭</a>
            </Dropdown>

        </Space>
    )
}
