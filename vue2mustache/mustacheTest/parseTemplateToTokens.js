import Scanner from "./Scanner";
export default function parseTemplateTOTokens(template){
    let tokens = [];
    let scanner = new Scanner(template);
    let word;
    while(scanner.pos<template.length){
        word = scanner.scanUntil('{{');
        if(word != ""){
            tokens.push(['text',word]);
        }
        scanner.scan('{{');
        word = scanner.scanUntil('}}');
        if(word != ""){
            tokens.push(['name',word]);
        }
        scanner.scan('}}');
    }
    return tokens;
}
