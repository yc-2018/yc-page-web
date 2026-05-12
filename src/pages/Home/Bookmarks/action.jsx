import {App} from "antd";
import {ExclamationCircleFilled} from "@ant-design/icons";
import {delBookmark} from "@/request/homeApi";
import CommonStore from "@/store/CommonStore";

/**
 * @param setList  要修改的状态列表
 * @param setModal 设置表单数据和开关
 * @param setItems 修改书签列表
 * @return {{string:Function}} 一个对象 key为事件名 value为事件回调
 * */
export default (setList, setModal, setItems = null) => {
  const {msg} = CommonStore
  const {modal} = App.useApp();

  return {
    'EDIT': object => {
      setModal(true, object.type, object)
      setItems && setItems()
    },
    'DELETE': object => modal.confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleFilled/>,
      content: '删除了就真的消失了',
      confirmLoading: true,
      async onOk() {
        try {
          await new Promise(async (resolve, reject) => {
            const delResp = await delBookmark(object);
            if (delResp) {
              setList(list => list.filter(item => item.id !== object.id));
              return resolve(); // 成功,关闭按钮加载 关闭窗口
            }
            return reject(); // 失败，关闭按钮加载,关闭窗口
          });
        } catch (error) {
          msg.error('删除异常')
        }
      }
    })
  }
}
