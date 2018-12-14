export interface IHistoryConfig{
    // 一部分浏览器按住返回按钮，会显示全部历史记录信息。该字段用于配置历史信息中返回页面的名字
    gobackName?: string
    // 类似于window.document.baseURI，此选项将透明地将给定字符串添加到basename的后面。
    basename? : string
    // 根路径
    root?: string
}