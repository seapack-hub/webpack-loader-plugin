export default class Compile{
    constructor(el,vue) {
        //vue实例
        this.$vue = vue;
        //挂载点
        this.$el = document.querySelector(el);
        if(this.$el){
            // 调用函数，让节点变为fragment，类似于mustache中的tokens。实际上用的是AST，这里就是轻量级的，fragment
            let $fragment = this.node2Fragment(this.$el);
            //编译
            this.compile($fragment);
            //替换好的内容要上树
            this.$el.appendChild($fragment);
        }
    }

    node2Fragment(el){
        /**
         * 创造一个DocumentFragment类型节点，可以把它当作虚拟节点,消耗小
         * 主要作用：充当其他要被添加到文档的节点的仓库，也就是充当初始父节点
         * 其parentNode值为空
         * @type {DocumentFragment}
         */
        let fragment = document.createDocumentFragment();
        let child;
        //获取文档节点中的第一个节点，并将其赋值给child
        while(child = el.firstChild){
            fragment.appendChild(child);
        }
        return fragment;
    }

    //编译
    compile(el){
        let childNodes = el.childNodes;
        let self = this;
        childNodes.forEach(node=>{
            //获取节点的文本
            let text = node.textContent;
            //nodeType值为1，代表元素节点
            if(node.nodeType == 1){
                self.compileElement(node);
            }else if(node.nodeType == 3){
                //nodeType值为3，代表文本节点
            }
        })
    }

    compileElement(node){
        //获取元素节点的属性，比如class,id等等。
        let nodeAttrs = node.attributes;
        //获取的nodeAttrs是一个类数组对象,将其转化为数组对象
        let nodeAttrsArray = [...nodeAttrs];
        nodeAttrsArray.forEach(attr=>{
            //在这里分析指令
            let attrName = attr.name;
            let value = attr.value;
            //指令都是v-开头的，取字符串2位后字符
            let dir = attrName.substring(2);
            //判断是否为指令
            if(attrName.indexOf('v-') == 0){
                //双向绑定
                if(dir == 'model'){
                    console.log('捕捉到v-model指令')
                }else if(dir == 'if'){
                    console.log('捕捉到v-if指令')
                    //v-if指令
                }
            }
        })
    }
}
