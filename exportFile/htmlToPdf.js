// utils/exportFile/htmlToPdf.js：导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export function htmlToPdf (id, title) {
  const element = document.getElementById(`${id}`);
  let count = 0;
  // a4纸纵向，一般默认使用；new JsPDF('landscape'); 横向页面
  const PDF = new JsPDF('p', 'pt', 'a4');
  const pageArr = [];
  const opts = {
    scale: 12, // 缩放比例，提高生成图片清晰度
    useCORS: true, // 允许加载跨域的图片
    allowTaint: false, // 允许图片跨域，和 useCORS 二者不可共同使用
    tainttest: true, // 检测每张图片已经加载完成
    logging: true, // 日志开关，发布的时候记得改成 false
    height: document.getElementById(`${id}`).scrollHeight,
    windowHeight: document.getElementById(`${id}`).scrollHeight,
    onclone:(page)=>{
      // 处理需要打印的odom存在竖直滚动条问题,横向没出现，未处理，思路一致
      let fDom = page.getElementById(id)
      // 获取odom整个内容高度
      let originHt = fDom.scrollHeight
      fDom.style.height = originHt + 'px'
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(fDom)
        }, 500)
      })
    }
  };
  console.log('element',element);
  html2Canvas(element, opts)
    .then((canvas) => {
      // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      console.log('canvas','contentWidth:',contentWidth,'contentHeight:',contentHeight)
      // 23028 6000
      // 一页pdf显示html页面生成的canvas高度;
      const pageHeight = (contentWidth / 592.28) * 841.89;
      console.log("pageHeight",pageHeight);
      // 未生成pdf的html页面高度
      let leftHeight = contentHeight;
      // 页面偏移
      let position = 0;
      // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      const imgWidth = 595.28;
      const imgHeight = (592.28 / contentWidth) * contentHeight;
      const pageData = canvas.toDataURL('image/jpeg', 1.0);
      console.log('imgWidth:',imgWidth,'imgHeight:',imgHeight);
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        // addImage(pageData, 'JPEG', 左，上，宽度，高度)设置
        PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        // 超过一页时，分页打印（每页高度841.89）
        while (leftHeight > 0) {
          PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight
          position -= 841.89
          if (leftHeight > 0) {
            PDF.addPage()
          }
        }
      }
      PDF.save(title + '.pdf');
    })
    .catch((error) => {
      console.log('打印失败', error)
    })
}

