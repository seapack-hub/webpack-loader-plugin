import XLSXStyle from "xlsx-style";

export default class Workbook{
  /**
   * 构造函数
   * 参数构造:[{sheetName:'',sheet:obj}]
   * @param workBookArr
   */
  constructor({workbookArr,fileName}) {
    this.workbookArr = workbookArr;
    this.fileName = fileName;
    this.blob = "";
    this.initData();
  }

  //初始化函数
  initData(){
    const {workbookArr} = this;
    if(!Array.isArray(workbookArr)){
      throw new Error("Workbook类的workBookArr参数类型异常");
    }else{
      this.blob = this.workbookToBlob();
    }
  }

  //数据转化workbook
  workbookToBlob(){
    const {workbookArr,fileName} = this;
    let workbook = {
      SheetNames: [],
      Sheets:{}
    }
    workbookArr.forEach((e,index)=>{
      let sheetName = e.sheetName || ('sheet'+(index +1));
      workbook.SheetNames.push(sheetName);
      workbook.Sheets[sheetName] = e.sheet;
    });
    let wopts = { bookType:"xlsx",bookSST:false,type:'binary'};
    let wbout = XLSXStyle.write(workbook,wopts);
    let blob = new Blob([s2ab(wbout)],{type:"application/octet-stream"});
    function s2ab(s){
      //ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区
      let buf = new ArrayBuffer(s.length);
      //Uint8Array 数组类型表示一个 8 位无符号整型数组，创建时内容被初始化为 0。
      //创建完后，可以以对象的方式或使用数组下标索引的方式引用数组中的元素。
      let view = new Uint8Array(buf);
      for(let i=0;i!=s.length;++i){
        //charCodeAt() 方法返回 0 到 65535 之间的整数，表示给定索引处的 UTF-16 代码单元
        view[i] = s.charCodeAt(i)&0xFF;
      }
      return buf;
    }
    return blob;
  }

  openDownloadDialog(){
    const {blob,fileName} = this;
    let url = blob;
    if(typeof url == "object" && url instanceof  Blob){
      //创建blob地址
      url = URL.createObjectURL(url);
    }
    let aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = `${fileName}` || '';
    let event;
    if(window.MouseEvent){
      event = new MouseEvent('click');
    }else{
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('click',true,false,window,0, 0, 0, 0, 0, false, false, false, false, 0, null)
    }
    aLink.dispatchEvent(event);
  }
}
