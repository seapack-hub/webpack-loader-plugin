import * as XLSX from "xlsx";
import {getColName} from "@/utils/exportFile/filter.js"

export default class Sheet {

  constructor({tableHeader = [],tableData,isMerger,isTotal,decimals,headerStyle,tableStyle}) {
    //表头信息
    this.tableHeader = JSON.parse(JSON.stringify(tableHeader));
    //表头合并初始信息
    this.outMarge = {
      startCell: -1,  //当前列开始位置
      basisRow: 0,    //全局行开始的位置
      basisCell: 0,   //全局列开始的位置
      maxRow: 0
    };
    //表格需要合并列信息
    this.mergerItem = [];
    //表格数字列
    this.formatItem = [];
    //获取日期列
    this.dateItem = [];
    //获取位置列信息
    this.positionItem = [];
    //表头数据信息
    this.tableHeaderInfo = [];
    //表头合并信息
    this.headerMergerInfo = [];
    //初始表格数据，不可修改
    this.data = JSON.parse(JSON.stringify(tableData));
    //备份表格数据
    this.dataCopy = JSON.parse(JSON.stringify(tableData))
    //是否展示合并列
    this.isMerger = isMerger || false;
    //是否展示总计行
    this.isTotal = isTotal || false;
    //表头最大层级
    this.headerMaxLevel = 0;
    //数据保留位数
    this.decimals = decimals || 4;
    //表头样式
    this.headerStyle = headerStyle || {};
    //表格样式
    this.tableStyle = tableStyle || {};
    //初始化数据
    this.initData();
  }

  /**
   * 初始化数据
   */
  initData(){
    this.tableHeaderInfo = this.deterministicSequence();
    //统计数据列信息和合并列信息
    this.tableHeaderInfo.forEach(e=>{
      //获取数据列
      if(e.hasOwnProperty('columnType')&& e.columnType == "number"){
        this.formatItem.push(e);
      }
      //获取合并列
      if(e.hasOwnProperty('isMerger')&& e.isMerger == true){
        let obj = {
          spanArr:[],
          pos:0,
          ...e
        }
        this.mergerItem.push(obj);
      }
      //获取日期列
      if(e.hasOwnProperty('columnType')&& e.columnType == "date"){
        this.dateItem.push(e);
      }
      //获取位置列
      if(e.hasOwnProperty('position')){
        this.positionItem.push(e);
      }
    });
    //获取表头最大层级
    this.headerMaxLevel =  this.maxLevel(this.tableHeader);
  }

  //获取表头合并信息
  getHeaderMergerInfo(){
    //获取表头和合并项初始数据
    const { tableHeader,outMarge,headerMaxLevel} = this;
    //获取合并的表头信息
    this.headerMergerInfo = this.resetMergeHeaderInfo(tableHeader,headerMaxLevel,outMarge);
    //获取表头的数据的横向跨度
    return this.headerMergerInfo;
  }

  //获取表格数据合并信息
  getDataMergerInfo(){
    const { data,dataCopy,mergerItem,headerMaxLevel,isMerger} = this;
    if(isMerger){
      //计算表格合并信息
      this.tableBodyMerge(this.data,dataCopy,mergerItem);
      //将合并信息整理成r,c对象格式
      const dataMergerInfo = this.calMergeInfo(data,mergerItem,headerMaxLevel+1);
      return dataMergerInfo;
    }else{
      return []
    }
  }

  //获取合并总信息
  getMergerAll(){
    const headerMergerInfo = this.getHeaderMergerInfo();
    const dataMergerInfo = this.getDataMergerInfo();
    return headerMergerInfo.concat(dataMergerInfo);
  }

  //处理数据信息
  disposeData(){
    const {dataCopy,isTotal,tableHeader,headerMaxLevel,headerMergerInfo} = this;
    if(isTotal){
      //为备份数据添加合计行
      this.computeTotalLine(dataCopy);
    }
    //获取表头的数据的横向跨度
    const lastChild = this.getLastChild(tableHeader);
    //获取表头数组
    const headData = this.getHeadArr(tableHeader,lastChild,headerMaxLevel,headerMergerInfo);
    //获取表格数组
    const bodyData = this.getDataArr(dataCopy,lastChild);
    //将合并数据转化为二维数组
    return headData.concat(bodyData);
  }

  //data转化为sheet
  dataToSheet(){
    const {headerMaxLevel,headerStyle,tableStyle} = this;
    //获取合并信息
    const merges = this.getMergerAll();
    //获取数据信息
    const data = this.disposeData();
    //转化为ws
    let ws = XLSX.utils.aoa_to_sheet(data);
    //设计样式
    this.designStyle(ws,merges,headerMaxLevel+1,headerStyle,tableStyle);
    //设计导出字段数据格式
    this.designDigital(ws,headerMaxLevel+1)
    //设置合并信息
    ws['!merges'] = merges;
    return ws;
  }

  /**
   * 合并表头信息
   * @param tableHeader 表头数据
   * @param maxLevel 表头深度
   * @param outMarge 合并表头存储临时信息
   * @param result 最终结果
   */
  resetMergeHeaderInfo(tableHeader,maxLevel,outMarge,result=[]){
    //为最外层表格信息做个isOut标记
    this.tagHeadIn();
    this.tagMaxLevel(tableHeader);
    //处理最外层表格信息
    for(let i = 0; i<tableHeader.length;i++){
      let item = tableHeader[i];
      //纵向跨度 通过tagMaxLevel方法做的标记
      const { maxLen } = item;
      //横向跨度
      let lastChild = this.getLastChild(item.children || []);
      //开始节点,r代表行，c代表列
      let s = {};
      //结束节点
      let e = {};
      //没有子级
      if(!item.children){
        //是否最外层元素
        if(item.isOut){
          //当前列开始位置
          outMarge.startCell += 1;
          //全局列开始位置
          outMarge.basisCell += 1;
          //开始行
          s.r = 0;
          //结束行
          e.r = maxLevel;
          //开始列
          s.c = outMarge.startCell;
          //结束列
          e.c = outMarge.startCell;
          result.push({s,e,item});
        }else{
          //不是外层元素
          //开始行
          let r = maxLevel - (outMarge.basisRow + maxLen);
          r = Math.max(r,0);
          s.c = outMarge.basisCell;
          e.c = outMarge.basisCell;
          s.r = outMarge.basisRow;
          e.r = r + outMarge.basisRow + maxLen;
          result.push({s,e,item});
          //开始行数据 +1
          outMarge.basisCell += 1;
        }
      }else{
        //有子级 是外层元素
        if(item.isOut){
          //开始行
          s.r = 0;
          //结束行
          e.r = 0;
          //局部开始列自增
          outMarge.startCell +=1;
          //开始列
          s.c = outMarge.startCell;
          //开始列加上横向跨度
          outMarge.startCell += lastChild.length -1;
          //结束列
          e.c = outMarge.startCell;
          result.push({s,e,item});
        }else{
          //不是外层元素
          s.c = outMarge.basisCell;
          e.c = outMarge.basisCell + lastChild.length -1;
          s.r = outMarge.basisRow;
          e.r = outMarge.basisRow;
          result.push({s,e,item});
        }
        outMarge.basisRow += 1;
        this.resetMergeHeaderInfo(item.children,maxLevel,outMarge,result);
      }
    }
    outMarge.basisRow -= 1;
    return result;
  }

  /**
   * 标记最外层数据
   */
  tagHeadIn(){
    const { tableHeader } = this;
    //为表头信息最外层添加一个isOut属性
    tableHeader.forEach((el)=>{
      el.isOut = true;
      return el;
    })
  }

  /**
   * 获取每一层级的最大层级,求横向长度
   * @param arr 表头数据
   * @param isSetFloor 为该层级设置floor属性
   * @returns {number}
   */
  maxLevel(arr,isSetFloor = true){
    //let floor = -1;
    let max = -1;
    //创建each方法便于递归
    function each(data,floor){
      data.forEach(e=>{
        //取floor，max中的最大值赋值给 max
        max = Math.max(floor,max);
        //isSetFloor为true，则为改层级设置floor属性
        isSetFloor && (e.floor = (floor + 1));
        if(e.children){
          //如果有下一级,floor+1 递归
          each(e.children,floor + 1);
        }
      })
    };
    each(arr,0);
    return max;
  }


  /**
   * 为每层级添加 maxLen 最大层级属性标记
   * @param tableHeader 表头数据
   */
  tagMaxLevel(tableHeader){
     const maxLevel = this.maxLevel(tableHeader,false);
     tableHeader.forEach((el)=>{
       if(!el.children){
         el.maxLen = maxLevel;
       }else{
         this.tagMaxLevel(el.children);
         el.maxLen = maxLevel;
       }
     })
  }

  /**
   * 获取当前节点所有叶子节点,叶子节点的数量作为当前单元格的横向跨度
   * @param arr 表头数据
   * @param result 存储子级信息数组
   * @returns {*[]}
   */
  getLastChild(arr,result = []){
    for(let i=0,item;item = arr[i++];){
      if(!item.children){
        result.push(item);
      }else{
        result = this.getLastChild(item.children,result);
      }
    }
    return result;
  }

  /**
   * 将表头数据转化为二位数组
   * @param tableHeader 表头数据
   * @param lastChild 当前单元格下所有子级数据
   * @param maxLevel 最大深度
   * @param mergeInfo 表头合并信息
   * @returns {*[]}
   */
  getHeadArr(tableHeader,lastChild,maxLevel,mergeInfo){
    let headArr = [];
    //初始化表头二位数组；
    for(let i=0;i<(maxLevel+1);i++){
      headArr[i] = new Array(lastChild.length).fill(null);
    }
    //为表头二位数组赋值
    for(let i=0;i<mergeInfo.length;i++){
      //将表头合并项信息开始位置复制到表头数组指定位置
      let info = mergeInfo[i];
      const {s,item} = info;
      const {c,r} = s;
      const {label} = item;
      headArr[r][c] = label;
    }
    return headArr;
  }

  /**
   * 将表格数据转化为二维数组
   * @param data
   * @param lastChild
   * @returns {*[]}
   */
  getDataArr(data,lastChild){
    //创建表格数据数组
    let result = [];
    //存储数字列
    let tempNumType = [];
    //添加数据列
    this.formatItem.forEach(e=>tempNumType.push(e.prop));
    for(let j = 0;j<data.length;j++){
      let ele = data[j]
      let value = [];
      for(let i=0,item;item = lastChild[i++];){
        let tempValue = "";
        if(this.isTotal&& j == data.length -1){
          tempValue = ele[item.prop] || "";
        }else{
          tempValue = ele[item.prop] || (tempNumType.indexOf(item.prop)!=-1?"0":"");
        }
        value.push(tempValue);
      };
      result.push(value);
    }
    //合计行添加合计
    if(this.isTotal){
      result[result.length-1][0] = '合计';
    }
    return result;
  }

  /**
   * 设计表头和表格样式
   * @param ws 数组转化后的sheet格式数据
   * @param mergeInfo 表头合并信息
   * @param maxLevel 最大层级，从1开始
   * @param headerStyle 表头样式，默认为空对象
   * @param tableStyle 表格样式，默认为空对象
   */
  designStyle(ws,mergeInfo,maxLevel,headerStyle={},tableStyle={},){
    //设置表格列宽
    let colsP = mergeInfo.map(e=>{
      //没有设置宽度默认为120px
      return {'wpx': e.item?Number(e.item.width||e.item.minWidth):120}
    });
    ws['!cols'] = colsP;
    //设计基本样式
    let baseStyle = {
      // 字体
      font: {
        name: '宋体',
        sz: 10,
        bold: false  //黑体
      },
      //居中
      alignment: {
        horizontal: 'center',//水平居中
        vertical: 'center', //垂直居中
        wrapText: true
      },
      border: {//边框
        bottom: { style: 'thin', color: 'FF000000'},
        top:{ style: 'thin', color: 'FF000000'},
        left:{ style: 'thin', color: 'FF000000'},
        right:{ style: 'thin', color: 'FF000000'}
      }
    };
    //设计表头基本样式
    let headerBaseStyle = Object.assign({fill: { fgColor: { rgb: 'C0C0C0' }},},baseStyle)
    for(let i in ws){
      //设置表头样式 排除！的选项
      if(i.indexOf("!") ==-1 && i.replace(/[^0-9]/ig,"")<=maxLevel){
        if(typeof headerStyle != 'object' || JSON.stringify(headerStyle) == '{}'){
          let data = JSON.parse(JSON.stringify(headerBaseStyle));
          ws[i].s = data;
        }else{
          let data = JSON.parse(JSON.stringify(headerStyle));
          ws[i].s = data;
        }
      }
      //设计表格样式
      if(i.indexOf("!") ==-1 && i.replace(/[^0-9]/ig,"")>maxLevel){
        if(typeof headerStyle == 'object' && JSON.stringify(headerStyle) != '{}'){
          let data = JSON.parse(JSON.stringify(tableStyle));
          ws[i].s = data;
        }else{
          let data = JSON.parse(JSON.stringify(baseStyle));
          ws[i].s = data;
        }
      }
    }
  }

  /**
   * 设置字体列返回字体格式
   * @param ws
   * @param maxLevel
   * @param formatItem
   * @param decimals 保留小数位数
   */
  designDigital(ws,maxLevel){
    const {decimals,formatItem,dateItem,positionItem,isTotal,headerMaxLevel,dataCopy} = this;
    //此时格式为保留整数
    for(let i in ws){
      if(i.indexOf("!") ==-1){
        let cellName = "";
        //设计数字格式
        formatItem.forEach(e=>{
          //获取列名 #,##0.00
          let str = "#,##0";
          cellName = getColName(e.columnIndex);
          if(i.replace(/[^0-9]/ig,"") > maxLevel && i.replace(/[^A-Z]/ig,"") == cellName){
            //设置数字格式为 number
            ws[i].t = "n";
            if(typeof e.decimals == 'number'){
              if(e.decimals >0){
                str = str+"."+"".padStart(e.decimals,"0");
              }
            }else{
              if(decimals>0){
                str = str+"."+"".padStart(decimals,"0");
              }
            }
            //设置千分位分隔
            ws[i].s.numFmt = str;
          }
        });
        //设计日期格式
        dateItem.forEach(e=>{
          cellName = getColName(e.columnIndex);
          let index = i.replace(/[^0-9]/ig,"");
          if(index > maxLevel && i.replace(/[^A-Z]/ig,"") == cellName){
            ws[i].t = "d";
            if(e.columnIndex == 0 && isTotal){
              if(index == headerMaxLevel+dataCopy.length+1){
                ws[i].t = "s";
              }
            }
          }
        });
        //位置设置
        positionItem.forEach(e=>{
          cellName = getColName(e.columnIndex);
          if(i.replace(/[^A-Z]/ig,"") == cellName){
            try{
              ws[i].s.alignment.horizontal = e.position;
            }catch(e){
              console.log(e);
            }
          }
        })
      }
    }
  }

  /**
   * 合并表格列数据
   * @param tableData
   * @param mergerItem
   */
  tableBodyMerge(tableData,tableDataCopy,mergerItem){
    //循环处理列数据，进行每列的合并
    for(let n=0; n <mergerItem.length; n++){
      //初始化spanArr
      mergerItem[n].spanArr = [];
      for(let i = 0;i<tableData.length;i++){
        if(i===0){
          //第一行设置该列的合并行数量为1，pos为合并行数量的起始的位置
          mergerItem[n].spanArr.push(1);
          mergerItem[n].pos = 0;
        }else{
          //判断两行同列元素是否相同
          if(tableData[i][mergerItem[n].prop] == tableData[i-1][mergerItem[n].prop]){
            //相同则该列合并行数量加1，并且在数组尾部加0，
            mergerItem[n].spanArr[mergerItem[n].pos] +=1;
            mergerItem[n].spanArr.push(0);
            //相同时将前一个元素置空
            tableDataCopy[i][mergerItem[n].prop]='';
          }else{
            //不相同，则设置该列的合并行数量为1，并且将该列的合并行起始位置pos 设置为行数的位置
            mergerItem[n].spanArr.push(1);
            mergerItem[n].pos = i;
          }
        }
      }
    }
  }

  /**
   * 计算表格合并列信息
   * @param tableData 表格数据
   * @param mergerItem 表格合并信息
   * @param maxHeadHeight 表头最大深度
   * @returns {*[]}
   */
  calMergeInfo(tableData,mergerItem,maxHeadHeight){
    let arr = [];
    //从列开始计算合并信息
    //需要合并的列信息以及
    for(let item of mergerItem){
      //找到表格的那一列数据
      let index = maxHeadHeight;
      //计算表格合并行起始位置，为表头深度-1，因为excel表格行数据从0开始计算
      let temp = index -1;
      for(let i = 0; i<tableData.length;i++){
        //e 为结束单元格，s 为开始单元格
        //r 为单元格行位置，c 为单元格列位置
        if(i==0){
          //特殊处理第一行数据，开始行位置为表头的深度。结束行位置为：开始行位置+合并的列数-1
          let obj = {
            e:{r:index+item.spanArr[i]-1,c:item.columnIndex},
            s:{r:index,c:item.columnIndex}
          };
          arr.push(obj);
          //存储已经合并的列数
          temp += item.spanArr[i];
        }else{
          //寻找需要合并的列，
          if(item.spanArr[i] !== 0){
            //合并列开始行位置：已经使用的列数+1,
            //合并列结束行位置：合并列开始行位置+合并的列数-1
            let obj = {
              e:{r:temp + item.spanArr[i],c:item.columnIndex},
              s:{r:temp + 1,c:item.columnIndex}
            };
            arr.push(obj);
          }
          temp += item.spanArr[i];
        }
      }
    }
    return arr;
  }

  /**
   * 计算表格合计列
   * @param data
   */
  computeTotalLine(data){
    let obj = {};
    this.formatItem.forEach(e=>{
      if(e.isTotal){
        //计算每列的合计值
        let propValue = data.reduce((prev,curr)=>{
          const value = Number(curr[e.prop]);
          if(!isNaN(value)){
            return prev + value;
          }else{
            return prev;
          }
        },0);
        obj[e.prop] = propValue;
      }
    });
    data.push(obj);
  }


  /**
   * 利用森林的先根遍历思想，确定序列顺序
   * 确定序列
   */
  deterministicSequence(){
    let tempArr = [];
    let index = 0;
    //创建一个内部函数
    function recursion(header,tmp){
      header.forEach(e=>{
        if(e.children && e.children.length>0){
          recursion(e.children,tmp);
        }else{
          let obj = {columnIndex:index++,prop:e.prop};
          //其他属性
          let arr = ['columnType','isMerger','decimals','isTotal','position'];
          arr.forEach(val=>{
            if(Object.prototype.hasOwnProperty.call(e,val)){
              obj[val] = e[val];
            }
          })
          tmp.push(obj);
        }
      })
    };
    recursion(this.tableHeader,tempArr);
    return tempArr;
  }
}
