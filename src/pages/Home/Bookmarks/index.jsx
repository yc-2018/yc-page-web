import React, {useState} from "react";

import MyDnd from "../../../compontets/MyDnd";
import Dnd from "../../../compontets/Dnd";
import {Button, Dropdown} from "antd";


export default function Bookmarks() {
    const [items, setItems] = useState([
        {id: "11hhh", name: 'Item 111111'},
        {id: "22hhh", name: 'Item 2222'},
        {id: "33hhh", name: 'Item 33'},
        {id: "43hhh", name: 'Item 44'},
        {id: "5hhh", name: 'Item 55'},
        {id: "6hhh", name: 'Item 66'},
        {id: "37h", name: 'Item 77'},
        {id: "338h", name: 'Item 88'},
        {id: "33h9hh", name: 'Item 99'},
        {id: "331hhh", name: 'Item aa'},
        {id: "33h11hh", name: 'Item ss'},
        {id: "33h12hh", name: 'Item dd'},
        {id: "3314hhh", name: 'Item ff'},
        {id: "33hh13h", name: 'Item gg'},
        {id: "33h15hh", name: 'Item hh'},
        {id: "dd", name: 'Item dd'},
        {id: "cc", name: 'Item cc'},
        {id: "zz", name: 'Item zz'},
        {id: "vv", name: 'Item vv'},
        {id: "tt", name: 'tt hh'},
    ]);


    return (
        <MyDnd dndIds={items} setItems={setItems}>
                {items.map(item =>
                    <MyDnd.Item key={item.id} id={item.id} styles={{padding: '1px 0'}} drag={<span style={{color:'#00000030'}}>☰</span>}>
                        <Dropdown
                            dropdownRender={() =>
                                <div className={'ant-dropdown-menu'}>
                                    <Dnd/>
                                </div>
                            }
                        >
                            <Button ghost           // 使按钮背景透明
                                    type="dashed"
                                    size='small'
                                    href={"https://ant-design.gitee.io/components/dropdown-cn"}
                                    style={{textShadow:' 0px 0px 5px #abc9ec', borderColor: 'rgb(0 0 0)'}}
                            >
                                {item.name}
                            </Button>
                        </Dropdown>
                    </MyDnd.Item>
                )}
            </MyDnd>
    )
}
