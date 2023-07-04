import Scanner from "./Scanner"
export default class Mustache{
    constructor(template,data){
        console.log(template,data);
        let scanner = new Scanner(template);
        while(scanner.pos<template.length){
            let text = scanner.scanUntil('{{');
            console.log(text,scanner.pos);
            scanner.scan('{{');
            text = scanner.scanUntil('}}');
            console.log(text,scanner.pos);
            scanner.scan('}}');
        }
    }
}
