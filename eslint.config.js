import js from '@eslint/js'                                // 导入 ESLint 核心规则
import globals from 'globals'                              // 导入全局变量定义
import reactHooks from 'eslint-plugin-react-hooks'         // React Hooks 规则
import reactRefresh from 'eslint-plugin-react-refresh'     // React 热更新规则
import tseslint from 'typescript-eslint'                   // TypeScript ESLint 支持

export default tseslint.config(
  // 基础配置
  { ignores: ['dist'] },    // 忽略 dist 目录:避免检查构建输出文件

  // 主配置对象
  {
    // 扩展规则集
    extends: [
      js.configs.recommended,           // ESLint 推荐规则      变量声明、作用域等基础规则
      ...tseslint.configs.recommended,  // TypeScript 推荐规则  类型检查、TS 语法规则
    ],

    // 应用范围
    files: ['**/*.{ts,tsx}'],           // 只检查 TypeScript 和 TSX 文件:不检查 JavaScript 文件

    // 语言环境配置
    languageOptions: {
      ecmaVersion: 2020,                // 使用 ES2020 语法 (可选链操作符?.、空值合并??等)
      globals: globals.browser,         // 识别浏览器全局对象 (window, document, navigator等)
      parserOptions: {
        ecmaFeatures: {
          jsx: true // 确保启用 JSX 解析
        }
      }
    },

    /*
    * ——————————插件系统————————
     * 强制执行：
     * Hooks 只能在函数组件顶部调用
     * 必须正确处理依赖数组
     * 禁止在条件语句中使用 Hooks
    */
    plugins: {
      'react-hooks': reactHooks,        // 启用 React Hooks 检查
      'react-refresh': reactRefresh,    // 启用 React Fast Refresh 检查
    },

    // 自定义规则
    rules: {
      ...reactHooks.configs.recommended.rules,    // 应用 React Hooks 推荐规则
      'quotes': ['error', 'single'],              // 字符串强制使用单引号
      'jsx-quotes': ['error', 'prefer-double'],   // 组件属性强制使用双引号

      // React Fast Refresh 规则  确保：文件只导出 React 组件、允许导出常量 (如配置对象)、热更新能正常工作
      'react-refresh/only-export-components': [
        'warn', // 警告级别
        { allowConstantExport: true },  // 允许导出常量
      ],
    },
  },
)
