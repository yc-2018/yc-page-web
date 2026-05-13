/** Ant Design 消息实例类型 */
export type MessageInstance = ReturnType<typeof import('antd').App.useApp>['message']

/** Ant Design 菜单点击事件参数类型 */
export type MenuClickInfo = Parameters<NonNullable<import('antd').MenuProps['onClick']>>[0]
