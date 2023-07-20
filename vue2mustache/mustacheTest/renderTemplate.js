/**
 * renderTemplate方法主要作用是将tokens和data结合，并转化为字符串
 * @param tokens
 * @param data
 */
export default function renderTemplate(tokens,data){
    let templateStr = "";
    console.log(tokens,data);
    for(let i = 0;i<tokens.length;i++){
        let token = tokens[i];
        switch(token[0]){
            case "text":
                templateStr += token[1];
                break;
            case "name":
                templateStr += data[token[1]];
                break;
            default:break;
        }
    }
    return templateStr;
}
