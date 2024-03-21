import React from 'react';
import Markdown from 'markdown-to-jsx';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import styles from './md.module.css'

// 创建自定义主题，继承原有主题并添加单行代码样式
const customTheme = {
    hljs: {
        color: '#c7254e',
        backgroundColor: '#f9f2f4',
        borderRadius: 2,
        display: 'inline',
    },
    // 可能还需要进一步自定义其他部分，具体取决于你希望修改哪些样式
};

const CodeBlock = ({children, className}) => {
    const isSingleLine = !/\n/.test(children) && !className    // 判断是否为单行代码 还是有点问题的

    // 使用不同的样式来区分单行和多行代码
    return (
        <SyntaxHighlighter
            language={className?.replace(/language-/, '')}
            style={isSingleLine ? customTheme : a11yDark}
        >
            {isSingleLine ? children.trim() : children}
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

    };

    return <Markdown options={options}>{children}</Markdown>

};
