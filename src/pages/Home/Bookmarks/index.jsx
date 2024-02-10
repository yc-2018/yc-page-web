import { Button, Dropdown, Space } from 'antd';
import CommonStore from "../../../store/CommonStore";
import Dnd from "../../../compontets/Dnd";


export default function Bookmarks() {
    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://ant-design.gitee.io/components/dropdown-cn">     {/*添加 rel="noopener" 可以阻止新页面通过 window.opener 属性访问和操纵打开它的页面。这有助于防止某些类型的恶意攻击，比如点击劫持。noreferrer：这个值用于指示浏览器在打开链接时不要发送 HTTP 引用头。通常，当用户点击一个链接时，浏览器会向新页面传递一个引用头（Referrer Header），告诉新页面这个请求是从哪个页面发起的。noreferrer 可以用来增强隐私保护，因为它阻止了这种行为。同时，它也隐式地提供了 noopener 的功能，因为在不发送引用头的情况下，新页面通常无法访问 window.opener。*/}
                    下拉菜单 Dropdown - Ant Design
                </a>
            ),
            icon: <img alt src="https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png" width={10} />,
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item (disabled)
                </a>
            ),
            icon: <img alt src="https://g.csdnimg.cn/static/logo/favicon32.ico" width={10} />,
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer"  href="https://x.chatmindai.net/">
                    gpt一年
                </a>
            ),
            icon: <img alt src="https://x.chatmindai.net/Logo.png" width={10} />,
        },
        {
            key: '4',
            label: 'a danger item',
            icon: <img alt src="https://x.chatmindai.net/Logo.png" width={10} />,
        },



    ];

    return (
        <Space>

            <Dropdown menu={{ items, }} >
                <Button 
                    ghost 
                    type="dashed" 
                    size='small' 
                    href={"https://x.chatmindai.net/"} 
                    style={{textShadow:' 0px 0px 5px #abc9ec', borderColor: 'rgb(0 0 0)'}}
                >
                    ikun
                </Button>
            </Dropdown>

            <Dropdown
                dropdownRender={() =>
                    <div className={'ant-dropdown-menu'}>
                        <Dnd/>
                    </div>
                }
            >
                <Button ghost type="dashed" size='small' href={"https://ant-design.gitee.io/components/dropdown-cn"}>小黑子</Button>
            </Dropdown>


            <Dropdown onClick={() => { CommonStore.msg.info('不知道怎么写好，害') }}
                dropdownRender={() =>
                    <img alt src="https://x.chatmindai.net/Logo.png" width={50} />
                }
            >
                <Button ghost type="dashed" size='small' >
                    吃饭码
                </Button>
            </Dropdown>


            <Dropdown dropdownRender={() => <div />}>
                <a rel="noopener noreferrer"  href='https://ant-design.gitee.io/components/select-cn'>antd选择器</a>
            </Dropdown>

        </Space>
    )
}
