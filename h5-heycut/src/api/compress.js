import { requestWithoutToken } from "@/utils/request";

/**提交压缩请求
 * @param {*} fileName   对应上传凭证接口返回的key
 * @param {*} keepScale  0-不保持原尺寸;1-保持原尺寸
 * @param {*} limitSize  压缩后最短边长 默认200
 * @param {*} type       压缩目标: S_1M
 * @returns
 */
export function componentVideo({ fileName, keepScale, limitSize, type }) {
  let formData = new FormData();
  formData.append("fileName", fileName);
  formData.append("keepScale", keepScale);
  formData.append("limitSize", limitSize);
  formData.append("type", type);
  return requestWithoutToken(
    "/wap/app-api/tools/tool-compress/customize/compress2",
    "post",
    formData
  );
}

/** 获取上传凭证
 * @returns
 */
export function getUploadProof() {
  return requestWithoutToken(
    "/wap/app-api/tools/tool-compress/uploadToken",
    "get"
  );
}

/** 压缩进度chaxun
 * @param {*} persistentId
 * @returns
 */
export function getCompressSchedule(persistentId) {
  return requestWithoutToken(
    "/wap/app-api/tools/tool-compress/operationStatus1",
    "get",
    { persistentId }
  );
}

/** 添加水印进度查询
 * @param {*} wmPid
 * @returns
 */
export function getWatermarkSchedule(wmPid) {
  return requestWithoutToken(
    "/wap/app-api/tools/tool-compress/operationStatusWm",
    "get",
    { wmPid }
  );
}

/** 数据记录
 * @param {*} url 七牛URL
 * @returns
 */
export function dataRecord(url) {
  let formData = new FormData();
  formData.append("url", url);
  return requestWithoutToken(
    "/wap/app-api/tools/tool-compress/saveData",
    "post",
    {
      url,
    }
  );
}
