import { makeAutoObservable } from 'mobx'

class ShowOrNot {
  //备忘录抽屉
  memoDrawerShow: boolean = !!localStorage.getItem('memoDrawerShow')
  //备忘英语抽屉
  englishDrawerShow: boolean = !!localStorage.getItem('EnglishDrawerShow')

  //构造函数
  constructor() {
    makeAutoObservable(this)  //自动化数据管理
  }


  //设置备忘录抽屉值
  setMemoDrawerShow(show: boolean) {
    localStorage.setItem('memoDrawerShow', show ? 'true' : '')
    this.memoDrawerShow = show
  }
  //设置备忘英语抽屉值
  setEnglishDrawerShow(show: boolean) {
    localStorage.setItem('englishDrawerShow', show ? 'true' : '')
    this.englishDrawerShow = show
  }

}

export default new ShowOrNot()