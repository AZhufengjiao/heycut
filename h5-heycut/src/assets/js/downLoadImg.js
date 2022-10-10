// 已支付 下载图片
export const downLoadimg = (url) => {
  // 调用已支付
  let Url = url; //图片路径，也可以传值进来
  var triggerEvent = "touchstart"; //指定下载方式
  var blob = new Blob([""], { type: "application/octet-stream" }); //二进制大型对象blob
  var url = URL.createObjectURL(blob); //创建一个字符串路径空位
  var a = document.createElement("a"); //创建一个 a 标签
  a.href = Url; //把路径赋到a标签的href上
  //正则表达式，这里是把图片文件名分离出来。拿到文件名赋到a.download,作为文件名来使用文本
  a.download = Url.replace(/(.*\/)*([^.]+.*)/gi, "$2").split("?")[0];
  /* var e = document.createEvent('MouseEvents');  //创建事件（MouseEvents鼠标事件）
          e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); //初始化鼠标事件（initMouseEvent已弃用）*/

  //代替方法。创建鼠标事件并初始化（后面这些参数我也不清楚，参考文档吧 https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent）
  var e = new MouseEvent(
    "click",
    (true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  );
  //派遣后，它将不再执行任何操作。执行保存到本地
  a.dispatchEvent(e);
  //释放一个已经存在的路径（有创建createObjectURL就要释放revokeObjectURL）
  URL.revokeObjectURL(url);
};
