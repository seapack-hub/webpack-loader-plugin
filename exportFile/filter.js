import {formatMoney} from "@/utils/filter.js"
import * as XLSX from "xlsx";
/**
 * 对表格数据进行格式化
 * @param formatItem  将要进行格式化的列标记
 * @param data  格式化的数据
 * @param decimals 保留小数的位数
 */
export function formatTableData({formatItem,data,decimals}){
  //遍历表格数据
  for(let d of data){
    for(let val of formatItem){
      d[val.prop] = formatMoney(d[val.prop],decimals);
    }
  }
  return data;
}

/**
 * file文件转化为workbook
 * @param file
 */
export function fileParsing(file){
  const reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = e => {
    let data = []
    const { result } = e.target
    // 以二进制流读取整份Excel表格对象  binary:二进制
    const workbook = XLSX.read(result, { type: 'binary' });
    // 遍历工作表进行读取（默认是第一张表）
    for (const sheet in workbook.Sheets) {
      if (workbook?.Sheets?.hasOwnProperty(sheet)) {
        //concat连接数组，将多个数组的元素合并为一个数组
        let arr = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        data = data.concat(arr)
      }
    }
  }
}

//列名元素集
const COL_ABC = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
/**
 * 十进制的数化为k进制的数【返回数组的index=0位置是最高位】（取k取余法）
 * @num 10进制数
 * @k k
 * @returns *[]
 */
function baseConversion(num,k) {
  let y = [];
  while (num > 0) {
    let s = Math.floor(num / k);
    let _y = num % k;
    if (s == 0){
      y.push(num);
      num = 0;
    }else{
      y.push(_y);
      num = s;
    }
  }
  return y.reverse();
}

/**
 * k进制的数化为十进制的数(乘幂相加法)
 * @kArray k进制数序列
 * @k k
 * @returns number
 */
function kTo10(kArray,k){
  let v10=0;
  let kArrayLen=kArray.length;
  for(let ind=0; ind<kArrayLen; ind++){
    v10 += kArray[ind] * Math.pow(k,kArrayLen - 1 - ind);
  }
  return v10;
}

/**
 * 获取列名
 * @colIndex 列序号（从0开始）
 * @returns string
 */
export function getColName(colIndex)
{
  if(colIndex < 0){
    return '';
  }
  let colNames =[];
  // 等于0 和 大于25 的 colIndex
  let isAdd1 = colIndex > 25 || colIndex < 1 ;
  //10进制转26进制
  let kArray = baseConversion(colIndex + (isAdd1 ? 1: 0), 26);
  for (let i = 0; i < kArray.length; i++) {
    colNames.push(COL_ABC[ kArray[i]- (isAdd1 ? 1: 0) ] || '');
  }
  return colNames.join('');
}
