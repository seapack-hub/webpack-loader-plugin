import Sheet from "./Sheet";
import Workbook from "./Workbook";
/**
 * 多级表头导出Excel
 * @param {Object} options - 导出选项对象
 * @param {string} options.fileName - 导出文件的名称
 * @param {Array} options.tableHeader - 表头数据
 * @param {Array} options.tableData  - 表格数据
 * @param {Object} [options.headerStyle={}] - 表头样式
 * @param {Object} [options.tableStyle={}] - 表格样式
 * @param {String} options.sheetName - sheet页名称
 * @param {number} [options.decimals=4] - 保留小数的位数 默认为4位
 * @param {Boolean} option.isMerger - 表格列是否合并
 * @params {Boolean} option.isTotal - 表格是否有合计行
 */
export function multilevelTableHead(options) {
  const {fileName,sheetName} = options;
  let sheetOptions = {...options}
  //将数据转化为sheet
  let sheet = new Sheet(sheetOptions).dataToSheet();
  let workbookOption = {
    fileName,
    workbookArr:[{sheetName,sheet}]
  }
  //将sheet页转化为工作蒲(workbook)
  const excel = new Workbook(workbookOption);
  //下载文件
  excel.openDownloadDialog();
}

/**
 * 多表导出
 * @param excelInfo
 * @param fileName 导出文件名称
 */
export function excelsExport(excelInfo,fileName){
  if(!Array.isArray(excelInfo)){
    throw new Error("excelsExport函数接收参数类型为数组！")
  }else{
    let workbookOption = {
      fileName,
      workbookArr:[]
    };
    excelInfo.forEach(e=>{
      let sheet = new Sheet(e.option).dataToSheet();
      let obj = {
        sheetName:e.sheetName,
        sheet
      }
      workbookOption.workbookArr.push(obj);
    });
    //将sheet页转化为工作蒲(workbook)
    const excel = new Workbook(workbookOption);
    //下载文件
    excel.openDownloadDialog();
  }
}
