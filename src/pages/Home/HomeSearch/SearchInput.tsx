// ////////// 搜索输入框 //////////////////文件创建路径：D:\AllCode\yc-web\src\pages\Home\HomeSearch\SearchInput.tsx  由`cgl`创建 时间：2025/11/25 1:08
import {FC, useState} from 'react';
import {AutoComplete, Input} from 'antd';
import {SendOutlined} from '@ant-design/icons';
import {getThinkList} from '@/request/homeApi';
import ISearchEngines from '@/interface/ISearchEngines';
import {setSearchValue, searchValue} from '@/pages/Home/HomeSearch/searchState';

let timer: number;

/**
 * 搜索输入框
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/11/25 1:18
 */
const SearchInput: FC<{ nowSearch: ISearchEngines }> = ({nowSearch}) => {
  const [anotherOptions, setAnotherOptions] = useState<{ value: string, label: JSX.Element }[]>([]);

  /** 设置关键字 */
  const setKeyword = (v: string) => setSearchValue(v)

  /** 输入框值变化时同步关键字并刷新联想列表 */
  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    autoThink(value)
  }

  /**
   * 搜索【新页面打开】
   *
   * @author Yc
   * @since 2025/7/16 1:57
   */
  const onSearch = () => window.open(nowSearch.engineUrl.replace('@@@', searchValue ?? ''), '_blank');

  /**
   * 自动通过接口联想
   *
   * @author Yc
   * @since 2025/7/16 1:41
   */
  const autoThink = (text: string) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(async () => {
      const list: { value: string }[] = await getThinkList(text);
      setAnotherOptions(list?.map(item => ({value: item.value, label: getOption(item)})) ?? [])
    }, 50)
  }

  /**
   * 生成联想项
   *
   * @author Yc
   * @since 2025/7/16 1:40
   */
  const getOption = (item: { value: string }) =>
    <div
      key={item.value}
      style={{display: 'flex', justifyContent: 'space-between'}}
      onClick={() => setKeyword(item.value)}
    >
      <span>{item.value}</span>
      <div className="searchGo" onClick={() => setTimeout(onSearch, 50)}>
        <SendOutlined/>
      </div>
    </div>;

  return (
    <AutoComplete
      options={anotherOptions}                      // 联想列表
      // value={searchValue.current}                // 输入框的值
      // open                                       // 测试用 一直展开联想列表
      onChange={handleKeywordChange}                // 输入框的值改变的回调
      classNames={{popup: {root: 'thinkList'}}}
      style={{width: 500, height: 40, margin: '5px 0 15px 0'}}
    >
      <Input.Search
        size="large"
        onSearch={() => setTimeout(onSearch, 50)}                   // 点击搜索按钮的回调
        placeholder="求知若渴，解惑在斯。"
        enterButton={[nowSearch.name, <SendOutlined key="搜索按钮"/>]}      // 搜索按钮
      />
    </AutoComplete>
  )
}
export default SearchInput;
