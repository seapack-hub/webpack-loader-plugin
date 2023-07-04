/**
 * Scanner 类主要作用是扫描模板字符串
 * 以'{{' 和 '}}'分隔，将字符串分离开来。
 */
export default class Scanner{
    constructor(template){
        //存储模板信息
        this.template = template;
        //初始标记位
        this.pos = 0;
        //剩余字符串
        this.tail = this.template;
    }

    scan(re){
        if(this.tail.indexOf(re) == 0){
            this.pos += 2;
            this.tail = this.template.substring(this.pos);
        }
    }

    scanUntil(re){
        let startIndex = this.pos;
        while(this.pos <this.template.length && this.tail.indexOf(re)!=0){
            this.pos++;
            this.tail = this.template.substring(this.pos);
        }
        return this.template.substring(startIndex,this.pos);
    }
}
