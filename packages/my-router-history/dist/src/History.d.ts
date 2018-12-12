export declare class MyHistory {
    private _state;
    private list;
    private constructor();
    static _instance: MyHistory;
    private _sysID;
    static instance(): MyHistory;
    initGoBack(): void;
    initURL(): void;
    baseURL(): string;
    private _testHash;
    private _hash2URL;
    init(): void;
    assign(url: any): void;
    goback(): void;
    replace(): void;
    reload(): void;
}
