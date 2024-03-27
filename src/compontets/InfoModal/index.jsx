import {observer} from "mobx-react-lite";
import {Modal} from "antd";
import UserStore from "../../store/UserStore";
import {useState} from "react";

export default observer(() => {
    const [confirmLoading, setConfirmLoading] = useState(false) // 是否加载中

    return (
        <Modal open={UserStore.infoModal}
               confirmLoading={confirmLoading}
               onCancel={()=>UserStore.setInfoModal(false)}
        >

        </Modal>
    )
})