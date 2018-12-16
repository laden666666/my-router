export interface IHistoryConfig{
    // 一部分浏览器按住返回按钮，会显示全部历史记录信息。该字段用于配置历史信息中返回页面的名字
    gobackName?: string
    // 根路径
    root?: string
}