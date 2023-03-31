
class PluginCompiler{
    apply(compiler){
      compiler.hooks.emit.tap('Plugin1',(compilation)=>{
          console.log('emit-tap~~~');
      });

      // compiler.hooks.emit.tapAsync('Plugin1',(compilation,cb)=>{
      //     setTimeout(()=>{
      //         console.log('emit-tapAsync~~')
      //     },2000);
      // });

      compiler.hooks.emit.tapPromise('Plugin1',(compilation)=>{
          return new Promise((resolve)=>{
              setTimeout(()=>{
                  console.log('tap-promise~~');
                  resolve()
              },2000)
          })
      });

      compiler.hooks.afterEmit.tap('Plugin1',(compiler)=>{
          console.log('after-emit-tap~~');
      });

      compiler.hooks.done.tap('Plugin',(status)=>{
          console.log('done-tap~~')
      })
    }
}

module.exports =PluginCompiler;
