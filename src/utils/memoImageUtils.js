/** 备忘前端最多添加图片数 */
export const MAX_MEMO_IMAGES = 6

/** 备忘图片数据库字段最大字符数 */
export const MAX_MEMO_IMAGE_VALUE_LENGTH = 999

/** 将备忘图片字段解析为有效原图地址列表 */
export const splitMemoImages = (imgArr) =>
  (imgArr ?? '').split(',').map(url => url.trim()).filter(Boolean)

/** 将原图地址列表序列化为备忘图片字段 */
export const joinMemoImages = (images) =>
  (images ?? []).map(url => url.trim()).filter(Boolean).join(',')

/** 判断备忘图片字段是否满足数据库长度限制 */
export const isMemoImageValueValid = (imgArr) =>
  (imgArr ?? '').length <= MAX_MEMO_IMAGE_VALUE_LENGTH
