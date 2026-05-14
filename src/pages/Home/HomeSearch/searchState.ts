/** 当前搜索框关键字 */
export let searchValue: string | undefined = undefined;

/** 更新当前搜索框关键字 */
export const setSearchValue = (value: string) => {
  searchValue = value
}
