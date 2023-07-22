// import lookup from "./lookup";
/**
 * renderTemplate方法主要作用是将tokens和data结合，并转化为字符串
 * @param tokens
 * @param data
 */
export default function renderTemplate(tokens,data){
    let templateStr = "";
    for(let i = 0;i<tokens.length;i++){
        let token = tokens[i];
        switch(token[0]){
            case "text":
                templateStr += token[1];
                break;
            case "name":
                templateStr += lookup(data,token[1]);
                break;
            case "#":
            case "^":
                templateStr += parseArray(token,data);
                break;
            default:break;
        }
    }
    return templateStr;
}

/**
 * 将token转换成字符串
 * @param token
 * @param data
 */
function parseArray(token,data){
    let tmpStr = "";
    let childrenTokens = token[2];
    let childData = [];
    if(!data.hasOwnProperty(token[1])){
        return tmpStr;
    }else{
        childData = data[token[1]];
        for(let i=0; i<childData.length; i++){
            tmpStr += renderTemplate(childrenTokens,childData[i]);
        }
    }
    return tmpStr;
}

/**
 * 取出data中对应的数据值
 * @param data
 * @param valueName
 */
function lookup(data,valueName){
    let temp = data;
    if(typeof temp == 'string' && valueName == '.'){
        return temp;
    }
    let nameArr = valueName.split(".");
    if(nameArr.length >0){
        for(let i = 0;i<nameArr.length;i++){
            temp = temp[nameArr[i]];
        }
        return temp;
    }
}
