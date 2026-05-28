import ISearchEngines from '@/interface/ISearchEngines';
import CommonStore from '@/store/CommonStore';
import {searchValue} from '@/pages/Home/HomeSearch/searchState';

const {msg} = CommonStore

/** 获取去除空格后的搜索词 */
const getKeyword = () => searchValue?.trim();

/** 获取去除空格后的直达URL */
const getDirectUrl = (search: ISearchEngines) => search.directUrl?.trim();

/** 打开搜索引擎：有搜索词时搜索，没有搜索词时优先走直达URL */
export const openSearchEngine = (search: ISearchEngines) => {
  const keyword = getKeyword(); // 当前搜索词
  if (keyword) {
    window.open(search.engineUrl.replace('@@@', keyword), '_blank');
    return;
  }

  const directUrl = getDirectUrl(search); // 空搜索词时的直达地址
  if (directUrl) {
    window.open(directUrl, '_blank');
    return;
  }

  msg.warning('请输入搜索内容')
}

/** 从右键菜单直接打开直达URL */
export const openDirectUrl = (search: ISearchEngines) => {
  const directUrl = getDirectUrl(search); // 右键菜单直达地址
  if (!directUrl) {
    msg.warning('未设置直达URL')
    return;
  }

  window.open(directUrl, '_blank');
}
