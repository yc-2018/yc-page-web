import React from 'react';
import Markdown from 'markdown-to-jsx';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/hljs';    // 浅蓝底docco

import styles from './md.module.css'
import {mdCodeLanguageList} from "@/store/NoLoginData";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import CommonStore from "../../store/CommonStore";

/** 有些默认对应不上的，就手动映射一下 */
const languageMapper = {
  "js": "javascript",
  "ts": "typescript",
  "javaScript": "javascript",
  "html": "htmlbars",
  "txt": "plaintext",
  "text": "plaintext",
  "py": "python",
  "sh": "shell",
  "cmd": "dos",
}

/** 内联代码片 和 代码块 */
const CodeBlock = ({children, className}) => {
  // 是 内联代码片 (单行代码)直接返回。  感觉还是有点问题的 但问题不大！
  if (!/\n/.test(children) && !className) {
    return <code className={styles.inlineCode}>{children}</code>;
  }
  // 这个md可能是有bug 三反单引号后面的语言名 有时会被当成第一行 然后代码语言类就消失了
  const lines = children.split('\n');
  const isIn = mdCodeLanguageList.includes(lines[0])
  if (isIn) {
    className = lines[0]
    children = lines.slice(1).join('\n')
  }
  console.log("███████className>>>>🔴", className,"🔴<<<<██████");
  const language = className?.split(/[\s-]+/).at(-1); // 获取代码语言 不管前面是空格还是减号 都切割拿最后一个单词
  return (
    <div className={styles.codeBlockWrapper}>
      <div className={styles.codeLangHead}>
        {language}
        <CopyToClipboard text={children} onCopy={() => CommonStore.msg.success('复制成功')}>
          <button className={styles.copyButton}>复制代码</button>
        </CopyToClipboard>
      </div>
      <SyntaxHighlighter
        className={styles.scrollbar}
        customStyle={{borderRadius: '0 0 8px 8px', marginTop: 0}}  // pre标签上的顶级样式组合的属性，这里的样式将覆盖以前的样式。
        showLineNumbers={lines.length > 2}           // 大于2行才显示行号（本来想1的 但是可能受上面说的bug影响 有的1行也会显示)
        language={languageMapper[language] ?? language}
        style={a11yDark}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

/** markdown解析组件，及自定义样式<br/>
 * <a href="https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/">高亮库官方demo</a>
 * <a href="https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_HLJS.MD">可用语言列表</a>
 * <a href="https://github.com/react-syntax-highlighter/react-syntax-highlighter">高亮库 GitHub</a><br/>
 * <a href="https://github.com/quantizor/markdown-to-jsx/">markdown-to-jsx GitHub</a>
 * <a href="https://markdown-to-jsx.quantizor.dev/">markdown-to-jsx官方demo</a><br/>
 * <a href="https://remarkjs.github.io/react-markdown/">react-markdown官方demo</a>
 * <a href="https://github.com/remarkjs/react-markdown">react-markdown GitHub</a><br/>
 * */
export default ({children}) => {
  const options = {
    overrides: {
      code: {component: CodeBlock},
      blockquote: {   // 引用块
        component: props =>
          <blockquote className={styles.blockquote}>
            {props.children}
          </blockquote>
      },
      table: {
        component: props =>
          <table style={{borderCollapse: 'collapse', width: '100%'}}>
            {props.children}
          </table>
      },
      th: {
        component: props =>
          <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left'}}>
            {props.children}
          </th>
      },
      tr: {
        component: props => <tr className={styles.tr}>{props.children}</tr>
      },
      td: {
        component: props =>
          <td style={{border: '1px solid #ddd', padding: '8px'}}>
            {props.children}
          </td>
      },
      a: ({href, children}) => <a href={href} target="_blank" rel="noreferrer">{children}</a>,
      kbd: {
        component: props =>
          <kbd className={styles.kbd}>
            {props.children}
          </kbd>
      },
      hr: () => <hr className={styles.hr}/>,
    },

  }

  return <Markdown options={options}>{children}</Markdown>
}
