**Tapable 的介绍与使用**<br>
Tapable工具是 webpack 的一个核心工具，但也可用于其他地方， 以提供类似的插件接口。<br>
Tapable 提供了一系列事件的发布订阅 API ，通过 Tapable我们可以注册事件，从而在不同时机去触发注册的事件进行执行。<br>
Webpack 中的 Plugin 机制正是基于这种机制实现在不同编译阶段调用不同的插件从而影响编译结果。<br>

webpack官网地址：[https://webpack.docschina.org/api/plugins/#tapable](https://webpack.docschina.org/api/plugins/#tapable) <br>
tapable的github地址：[https://github.com/webpack/tapable#tapable](https://github.com/webpack/tapable#tapable) <br>
<br>
在 webpack 中的许多对象都扩展自 Tapable 类。 它对外暴露了 tap，tapAsync 和 tapPromise 等方法， 
插件可以使用这些方法向 webpack 中注入自定义构建的步骤，这些步骤将在构建过程中触发。<br>
目前tapable暴露了9种Hook（钩子）类，为插件提供挂载的钩子
```aidl
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("tapable");
```
<br>
以最简单的SyncHook为例，

```aidl
// 初始化同步钩子
const hook = new SyncHook(["arg1", "arg2", "arg3"]);
// 注册事件
hook.tap('flag1', (arg1,arg2,arg3) => {
console.log('flag1:',arg1,arg2,arg3)
})
hook.tap('flag2', (arg1,arg2,arg3) => {
console.log('flag2:',arg1,arg2,arg3)
})
// 调用事件并传递执行参数
hook.call('19Qingfeng','wang','haoyu')
// 打印结果
flag1: 19Qingfeng wang haoyu
flag2: 19Qingfeng wang haoyu
```
使用步骤如下：
1.通过 new 关键字实例不同种类的Hook

<img height="400" src="https://github.com/seapack-hub/webpack-loader-plugin/blob/master/public/images/img.png" width="800"/><br>
其中Sync代表同步，Async代表异步。 除此之外我们可以看到上面的 Hook 还带了其他关键字：Basic，Waterfall，Bail，Loop<br>
Basic hook（没有 Waterfall、Bail、Loop 在它的名字里面）：所有 tapped 的事件依次执行，互不干扰 <br>
Waterfall：与 Basic hook 不同的是它将返回值从每个函数传递到下一个函数 <br>
Bail：当任何 tapped 函数返回了任何值，bail hook 将停止执行其余的函数 <br>
Loop：若任一事件的返回值不为 undefined，则该事件链再次从头开始执行，直到所有 handler 均返回 undefined <br>

tapable 暴露出来的都是类方法，new 一个类方法获得我们需要的钩子。<br>
class 接受数组参数options，非必传。类方法会根据传参，接受同样数量的参数<br>
`const hook1 = new SyncHook(["arg1", "arg2", "arg3"]);` <br>
hook 类对外提供的方法 <br>
包括tap,tapAsync,tapPromise,call,callAsync,promise等。<br>
使用 tap/tapAsync/tapPromise 绑定钩子<br>
使用 call/callAsync/promise 执行绑定事件<br>
<img height="300" src="https://github.com/seapack-hub/webpack-loader-plugin/blob/master/public/images/img_1.png" width="600"/> <br>
<img height="400" src="https://github.com/seapack-hub/webpack-loader-plugin/blob/master/public/images/img_2.png" width="600"/> <br>
参考文章：[https://juejin.cn/post/6844903713312604173](https://juejin.cn/post/6844903713312604173) <br>
tap方法接收两个参数：option和fn(函数)<br>
```aidl
_tap(type, options, fn) {
	if (typeof options === "string") {
		options = {
		  name: options.trim()
	    };
	} else if (typeof options !== "object" || options === null) {
	  throw new Error("Invalid tap options");
	}
	if (typeof options.name !== "string" || options.name === "") {
	  throw new Error("Missing name for tap");
	}
	if (typeof options.context !== "undefined") {
	  deprecateContext();
	}
	options = Object.assign({ type, fn }, options);
	options = this._runRegisterInterceptors(options);
	this._insert(options);
}

tap(options, fn) {
    this._tap("sync", options, fn);
}
```
<br>
