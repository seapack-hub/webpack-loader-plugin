import parseTemplateTOTokens from "./parseTemplateToTokens";
import renderTemplate from "./renderTemplate";
export default class Mustache{
    constructor(template,data){
        this.template = template;
        this.data = data;
        this.render();
    }
    render(){
        const {template,data} = this;
        //获取token
        let tokens = parseTemplateTOTokens(template);
        //将token与数据结合
        let templateStr = renderTemplate(tokens,data);
        console.log(templateStr);
        // console.log('---',tokens);
    }
}
