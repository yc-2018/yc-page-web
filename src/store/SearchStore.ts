import { makeAutoObservable } from 'mobx'

class SearchStore {
  searchEngines: string = localStorage.getItem('searchEngines') || 'Bing'
  quickSearchIcon: any = localStorage.getItem('quickSearchIcon') ?? true
  _searchIconTransparency:any = localStorage.getItem('searchIconTransparency') ?? 88

  
    //构造函数
    constructor() {
      makeAutoObservable(this)  //自动化数据管理
    }
  
    //设置查询值
    setSearchEngines(searchEngines:any) {
      localStorage.setItem('searchEngines',searchEngines)
      this.searchEngines = searchEngines;
    }

    setQuickSearchIcon(quickSearchIcon:boolean) {
      localStorage.setItem('quickSearchIcon', quickSearchIcon ? 'ikun' : '')
      this.quickSearchIcon = quickSearchIcon;
    }

    setSearchIconTransparency(searchIconTransparency:number) {
      // localStorage.setItem('searchIconTransparency', searchIconTransparency.toString())
      this._searchIconTransparency = searchIconTransparency;
    }

    get searchIconTransparency(){
      // 转数字再输出
      return parseInt(this._searchIconTransparency)
    }

    // get print() {
    //   //可以把本来的值美化在输出
    //   return null
    // } 


  }
  
  export default new SearchStore()