import React from 'react';
import Markdown from 'markdown-to-jsx';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import styles from './md.module.css'
import {mdCodeLanguageList} from "../../store/NoLoginData";


/**
 *  内联代码片 和 代码块
 * */
const CodeBlock = ({children, className}) => {
    // 是 内联代码片 (单行代码)直接返回。  感觉还是有点问题的 但问题不大！
    if (!/\n/.test(children) && !className) return <span className={styles.inlineCode}>{children}</span>;

    // 这个md可能是有bug 三反单引号后面的语言名 有时会被当成第一行 然后代码语言类就消失了
    const lines = children.split('\n');
    const isIn = mdCodeLanguageList.includes(lines[0])
    if (isIn) {
        className = `lang-${lines[0]}`
        children = lines.slice(1).join('\n')
    }

    return (
        <SyntaxHighlighter
            language={className?.replace(/language-/, '')}
            style={a11yDark}
        >
            {children}
        </SyntaxHighlighter>
    );
};

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
            kbd: {
                component: props =>
                    <kbd className={styles.kbd}>
                        {props.children}
                    </kbd>
            },
            hr: {component: () => <hr className={styles.hr}/>},
        },

    }

    return <Markdown options={options}>{children}</Markdown>
}
