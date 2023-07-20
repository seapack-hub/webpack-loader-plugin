/**
 * 主要作用是折叠tokens
 * @param tokens
 * @returns {*[]}
 */
export default function nestTokens(tokens){
    //创建一个数组，存储修改后的tokens
    let nestTokens = [];
    //创建一个栈,存储循环，条件数据
    let sections = [];
    //创建一个搜集器，搜集循环里面的数据
    let collector = nestTokens;

    for(let i = 0; i<tokens.length; i++){
        let token = tokens[i];

        switch(token[0]){
            case "#":
                //入栈
                sections.push(token);
                //收集器collector收集数据
                collector.push(token);
                //改变收集器collector指向，之后可以将循环内数据存放到token中
                collector = token[2] = [];
                break;
            case "/":
                //遇到/就出栈
                sections.pop();
                //每次出栈说明该层循环遍历完成，改变collector的指向，将其指回上一层
                collector = sections.length>0? sections[sections.length-1][2]:nestTokens;
                // console.log(aa+'，出栈了');
                break;
            default:
                collector.push(token);
                break;
        }
    }
    return nestTokens;
}
