let uid = 0;
export default class Dep{
    constructor(){
        this.id = uid++;
        //用数组存储自己的订阅者，subs是subscribes订阅者的意思
        //这个数组里存放watcher的实例
        this.subs = [];
        //存储id,保证唯一
        this.newWatcherIds = new Set();
    }

    //通知更新
    notify(){
        //浅克隆一份
        const subs = this.subs;
        //循环遍历
        for(let i=0,l=subs.length; i<l; i++){
            subs[i].update()
        }
    }

    //添加订阅
    addSub(sub){
        const id = sub.id;
        if(!this.newWatcherIds.has(id)){
            this.newWatcherIds.add(id);
            this.subs.push(sub);
        }
    }
    // 添加依赖
    depend() {
        // Dep.target就是一个我们自己指定的全局的位置，你用window.target也行，只要是全剧唯一，没有歧义就行
        if (Dep.target) {
            this.addSub(Dep.target);
        }
    }
}
