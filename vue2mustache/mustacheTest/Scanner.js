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
        //待扫描字符串
        this.tail = this.template;
        //开始位置
        this.startIndex = 0;
        //结束位置
        this.endIndex = 0;
    }

    /**
     * 匹配 {{ }} 等串，并使指针pos前进2位，
     * @param re
     * @returns {string|*}
     */
    scan(re){
        this.startIndex = this.pos;
        //匹配匹配待字符串中是否有 re
        let match = this.tail.match(re);

        //如果没有匹配到或匹配位置不是在头部，返回空字符串
        if(!match || match.index !== 0){
            return "";
        }

        //获取被匹配的字符 re
        let string = match[0];

        //待匹配字符串去掉被匹配的字符 re
        this.tail = this.tail.substring(string.length);

        //pos指针前进被匹配字符的长度
        this.pos += string.length;

        //返回被匹配字符re
        return string;
    }

    /**
     * 扫描模板字符串
     * @param re
     * @returns {string}
     */
    scanUntil(re){
        //search方法，用于检索字符串中指定的子串，或检索与正则表达式相匹配的子串，返回子串第一次出现的位置，没有匹配到则返回-1
        //index 是匹配子串的位置，  match是被被扫描的字符串
        let index = this.tail.search(re),match;

        switch(index){
            //未匹配到，待匹配字符串被扫描完毕
            case -1:
                match = this.tail;
                this.tail = "";
                break;
            //在字符串头部匹配到
            case 0:
                match = "";
                break;
            default:
                match = this.tail.substring(0,index);
                this.tail = this.tail.substring(index);
        }

        //指针pos前进扫描字符的长度
        this.pos += match.length;

        return match;
        // let startIndex = this.pos;
        // while(!this.eos() && this.tail.indexOf(re)!=0){
        //     this.pos++;
        //     this.tail = this.template.substring(this.pos);
        // }
        // this.endIndex = this.pos;
        // return this.template.substring(startIndex,this.pos);
    }

    /**
     * 判断模板字符串是否扫描完成
     * @returns {boolean}
     */
    eos(){
        return this.pos == '';
    }
}
