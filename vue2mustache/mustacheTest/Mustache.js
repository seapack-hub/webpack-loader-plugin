import parseTemplateTOTokens from "./parseTemplateToTokens";
export default class Mustache{
    constructor(template,data){
        this.template = template;
        this.data = data;
        this.render();
    }
    render(){
        const {template,data} = this;
        let tokens = parseTemplateTOTokens(template);
        console.log('---',tokens);
    }
}
