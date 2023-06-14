export default class Compile{
    constructor(el,vue) {
        //vue实例
        this.$vue = vue;
        //挂载点
        this.$el = document.querySelector(el);


    }
}
