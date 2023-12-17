import { makeAutoObservable } from 'mobx'

class SearchEnginesStore {
  searchEngines: string = localStorage.getItem('searchEngines') || 'Bing'
  
    //构造函数
    constructor() {
      makeAutoObservable(this)  //自动化数据管理
    }
  
    //设置查询值
    setSearchEngines(searchEngines:any) {
      localStorage.setItem('searchEngines',searchEngines)
      this.searchEngines = searchEngines;
    }
      
    // get print() {
    //   //可以把本来的值美化在输出
    //   return null
    // } 


  }
  
  export default new SearchEnginesStore()