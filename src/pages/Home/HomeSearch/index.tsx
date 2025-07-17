import {useRef, useState} from "react";
import {SendOutlined} from "@ant-design/icons";
import {getThinkList} from "@/request/homeApi";
import CommonStore from "@/store/CommonStore";
import {AutoComplete, Input} from "antd";

const {msg} = CommonStore
let timer: number;

/**
 * 首页搜索框组件
 *
 * @author Yc
 * @since 2025/7/16 2:01
 */
const SearchBox = () => {
  const [anotherOptions, setAnotherOptions] = useState<{ value: any }[]>([]);
  const [nowSearch, setNowSearch] = useState({id: 0, engineUrl: "https://www.baidu.com/s?wd=@@@", name: "百度"})
  const [, setSx] = useState<number>(0);
  const searchValue = useRef<string>();

  const sxYm = (_: any) => setSx(v => v + 1);

  /**
   * 搜索【新页面打开】
   *
   * @author Yc
   * @since 2025/7/16 1:57
   */
  const onSearch = () => window.open(nowSearch.engineUrl.replace('@@@', searchValue.current ?? ''), '_blank');

  /**
   * 生成联想项
   *
   * @author Yc
   * @since 2025/7/16 1:40
   */
  const getOption = (item: { value: string }) =>
    <div
      style={{display: 'flex', justifyContent: 'space-between',}} key={item.value}
      onClick={() => searchValue.current = item.value}
    >
      <span>{item.value}</span>
      <div className="searchGo">
        <SendOutlined onClick={() => setTimeout(onSearch, 50)}/>
      </div>
    </div>;

  /**
   * 自动通过接口联想
   *
   * @author Yc
   * @since 2025/7/16 1:41
   */
  const autoThink =  (text: string) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(async () => {
      const list: { value: string }[] = await getThinkList(text);
      setAnotherOptions(list.map(item => ({value: getOption(item)})))
    }, 50)
  }

  return (
    <div className="1searchBox">
      <AutoComplete
        classNames={{popup: {root: 'thinkList'}}}
        className="inputOpacity"
        // value={searchValue.current}                // 输入框的值
        options={anotherOptions}                      // 联想列表
        style={{width: 500, margin: '5px 0 15px 0'}}
        onChange={v => searchValue.current = v}       // 输入框的值改变的回调
        onSearch={autoThink}                          // 输入框值改变时联想列表的回调
        size="large"
      >
        <Input.Search
          size="large"
          onSearch={() => onSearch()}                 // 点击搜索按钮的回调
          placeholder="求知若渴，解惑在斯。"
          enterButton={[nowSearch.name, <SendOutlined key="搜索按钮"/>]}      //搜索按钮
        />
      </AutoComplete>
    </div>
  );
}

export default SearchBox;