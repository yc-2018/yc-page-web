import {useState, FC} from 'react';
import {AutoComplete, Input} from 'antd';
import searchStore from '@/store/SearchStore';
import {SendOutlined} from '@ant-design/icons';
import {getThinkList} from "@/request/homeRequest";
import "./MySearch.css"

const {Search} = Input;


interface ChildComponentProps {
  onSearch: (quickSearchUrl?: string | boolean, searchTerm?: string) => void;
  setSearchValue: (value: any) => void;
}

const MySearch: FC<ChildComponentProps> = ({onSearch, setSearchValue}) => {
  const [anotherOptions, setAnotherOptions] = useState<{ value: any }[]>([]);

  //存搜索框的值
  let searchValue:any = undefined;

  const getOption = (item: { value: string }) =>
    <div
      style={{display: 'flex', justifyContent: 'space-between',}} key={item.value}
      onClick={() => {
        setSearchValue(item.value);
        searchValue = item.value;
      }}
    >
      <span>{item.value}</span>
      <div className="searchGo"><SendOutlined onClick={() => onSearch(false, item.value)}/></div>
    </div>;


  const autoSearch = async (text: string) => {
    const list: { value: string }[] = await getThinkList(text);
    setAnotherOptions(list.map(item => ({value: getOption(item)})))
  }

  return (
    <AutoComplete
      classNames={{popup: {root: 'thinkList'}}}
      className="inputOpacity"
      value={searchValue}                 //输入框的值
      options={anotherOptions}            //联想列表
      style={{width: 500, margin: '5px 0 15px 0'}}
      onChange={v => {
        setSearchValue(v);
        searchValue = v;
      }}                         //输入框的值改变的回调
      onSearch={autoSearch}    //输入框值改变时联想列表的回调
    >
      <Search
        size="large"
        autoFocus
        onSearch={() => onSearch()}                                                    //点击搜索按钮的回调
        placeholder="求知若渴，解惑在斯。"
        enterButton={[searchStore.searchEngines, <SendOutlined key={'搜索按钮'}/>]}      //搜索按钮
      />
    </AutoComplete>
  );
};

export default MySearch;