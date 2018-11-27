/**
 * 生成urlid的工具函数。要求生成的id能够比较出生成的时间顺序。比能够比较他们的生成时间顺序。这样可以判断出url的先后顺序
 * 主要是在浏览器中url改变的时候,我们无法判断出是前进还是后退操作,因此需要一个机制能够让我们判断url的顺序。这个就是使用的id
 */
let idSeek = 0;

export default {
    createId : function () {
        var chars = "abcdefghij";
        idSeek++
        return (Date.now() * 10000 + idSeek + "").split("").map(num=>chars[num]).join("");
    },
    compareId(id, id2){
        if(id > id2){
            return 1;
        } else if(id < id2){
            return -1;
        } else {
            return 0;
        }
    }
}
