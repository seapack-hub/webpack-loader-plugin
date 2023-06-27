import Watcher from "../vue2ResponsivePrinciple/Watcher";
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

        //捕获{{}}文本数据
        let reg = /\{\{(.*)\}\}/;

        childNodes.forEach(node=>{
            //获取节点的文本
            let text = node.textContent;
            //nodeType值为1，代表元素节点
            if(node.nodeType == 1){
                self.compileElement(node);
            }else if(node.nodeType == 3 && reg.test(text)){
                //nodeType值为3，代表文本节点
                let name = text.match(reg)[1];
                self.compileText(node,name);
            }
        })
    }

    compileElement(node){
        //获取元素节点的属性，比如class,id等等。
        let nodeAttrs = node.attributes;
        //获取的nodeAttrs是一个类数组对象,将其转化为数组对象
        let nodeAttrsArray = [...nodeAttrs];
        let self = this;
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
                    // console.log('捕捉到v-model指令',node);
                    //将实际值放入v-model绑定的值
                    //此时vue中的数据改变会影响界面的数据，数据从vue流向界面。
                    new Watcher(self.$vue,value,value=>{
                        node.value = value;
                    });
                    //读取绑定的值
                    let v = self.getVueVal(self.$vue,value);
                    node.value = v;

                    //添加界面数据变动影响vue里面的数据，通过给元素添加监听事件实现。
                    node.addEventListener('input',e=>{
                        let newVal = e.target.value;
                        self.setVueVal(self.$vue,value,newVal);
                        v = newVal;
                    })
                }
            }
        })
    }

    compileText(node,name){
        //之前已经把data里面的数据循环遍历放到vue上了，所以可以传入vue
        node.textContent = this.getVueVal(this.$vue,name);
        //设置监控响应
        new Watcher(this.$vue,name,(newValue)=>{
            node.textContent = newValue;
        })
    }

    //获取使用的值a.b.n
    getVueVal(vue,exp){
        let val = vue;
        exp = exp.split(".");
        exp.forEach(key=>{
            val = val[key];
        })
        return val;
    }

    //修改值
    setVueVal(vue,exp,value){
        let val = vue;
        exp = exp.split(".");
        exp.forEach((key,i)=>{
            //获取最底层的值修改
            if(i< exp.length - 1){
                val = val[key]
            }else{
                val[key] = value;
            }
        })
    }
}
