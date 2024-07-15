import React from 'react';
/**
 * 搜索关键字高亮
 * @author ChenGuangLong
 * @since 2024/7/15 20:25
*/
const HighlightKeyword = ({ content, keyword }) => {
  if (!content || !keyword) return content;
  
  const regex = new RegExp(`(${keyword})`, 'gi');
  const parts = content.split(regex);
  let j = 0;  // 为什么不用i，因为i在三元表达式中，有可能出现1、3、5...全是同色
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part.toLowerCase() === keyword.toLowerCase()
            ? <b style={styles[j++ % styles.length]}>{part}</b>
            : part}
        </React.Fragment>
      ))}
    </>
  );
};
export default HighlightKeyword;

const styles = [
  {backgroundColor: '#0400ff29',color:'#000'},
  {backgroundColor: '#ff000029',color:'#000'},
]