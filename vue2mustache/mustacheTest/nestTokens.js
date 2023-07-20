/**
 * 主要作用是折叠tokens
 * @param tokens
 * @returns {*[]}
 */
export default function nestTokens(tokens){
    let nestTokens = [];
    //创建一个栈
    let sections = [];
    //创建一个临时数组，存放数据
    let tmpArr = [];

    for(let i = 0; i<tokens.length; i++){
        let token = tokens[i];

        switch(token[0]){
            case "#":
                //入栈
                sections.push(token[1]);
                console.log(token[1]+'，入栈了')
                break;
            case "/":
                //出栈
                let aa = sections.pop();
                console.log(aa+'，出栈了');
                break;
            default:
                nestTokens.push(token);
                break;
        }
    }
    return tokens;
}
