import React from 'react';

/**
 * 高亮文本链接接口
 *
 * @author Yc
 * @since 2025/3/31 21:05
 */
interface LinkifyContentInterface {
  children: string;                                   // 待处理的文本
  linkImg?: (part: string, index?: number) => React.ReactNode;   // 是否特殊处理?图片链接特殊处理函数
  linkVideo?: (part: string, index?: number) => React.ReactNode; // 是否特殊处理?视频链接特殊处理函数
}

// 正则表达式匹配不同类型的 URL
const urlRegex = /(https?:\/\/[^\s]+)/g;
const imageRegex = /\.(jpeg|jpg|gif|png|bmp|webp|svg)|ipfs/i; // 匹配图片格式 i是忽略大小写 ipfs当图片算了
const videoRegex = /\.(mp4|webm|ogg|mov)$/i; // 匹配视频格式 加了$就是要结尾才匹配

/**
 * 文本链接高亮组件 对图片链接或视频链接可特殊处理
 *
 * @author Yc
 * @since 2025/3/31 20:49
 */
const LinkifyContent: React.FC<LinkifyContentInterface> = (
  {
    children,
    linkImg,
    linkVideo
  }): React.ReactNode => {
  if (!children || typeof children !== 'string') return children;

  return children.split(urlRegex).map((part, index) => {
    // 检查算不算链接
    if (part.match(urlRegex)) {
      // 检查是否是图片格式
      if (linkImg && imageRegex.test(part)) return linkImg(part, index);
      // 检查是否是视频格式
      if (linkVideo && videoRegex.test(part)) return linkVideo(part, index);
      // 对其他链接格式使用 <a> 标签
      return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
    }
    // 返回普通文本
    return part;
  });
}

export default LinkifyContent;