import Scanner from "./Scanner";
import nestTokens from "./nestTokens";
export default function parseTemplateToTokens(template){
    let tokens = [];
    let scanner = new Scanner(template);
    let word;
    while(!scanner.eos()){
        word = scanner.scanUntil('{{');
        if(word != ""){
            tokens.push(['text',word]);
        }
        scanner.scan('{{');
        word = scanner.scanUntil('}}');
        if(word != ""){
            //判断是否有循环
            if(word[0] == "#"){
                tokens.push(['#',word.substring(1)]);
            }else if(word[0] == '/'){
                tokens.push(['/',word.substring(1)]);
            }else{
                tokens.push(['name',word]);
            }
        }
        scanner.scan('}}');
    }
    return nestTokens(tokens);
}
