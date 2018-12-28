export interface IHistoryConfig {
    // 一部分浏览器按住返回按钮，会显示全部历史记录信息。该字段用于配置历史信息中返回页面的名字
    gobackName?: string
    // 根路径
    root?: string
    // 当页面访问栈底不是根页面的时候，插入一条根页面到栈底
    insertRoot?: boolean

    // TODO
    // 刷新缓存
    enableCache?: boolean
    // url只读
    readOnlyURL?: boolean
}