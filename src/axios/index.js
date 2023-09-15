/*
 * @Author: LAPTOP-P7G9LM4M\wumen 332982129@qq.com
 * @Date: 2023-07-08 15:13:52
 * @LastEditors: LAPTOP-P7G9LM4M\wumen 332982129@qq.com
 * @LastEditTime: 2023-07-29 10:04:54
 * @FilePath: \chaofun-frontc:\Users\wumen\Documents\demochat002-front\src\axios\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";
const domain = process.env.REACT_APP_BASE_URL;
const post = (url, params) => {
  return axios({
    method: "post",
    url: `${domain}/api${url}`,
    data: params,
  }).then(function (response) {
    if (response.status === 200) {
      return response.data;
    } else if (response.status === 504) {
      return {};
    } else {
      return "error";
    }
  });
};

const get = (url, params) => {
  return axios({
    method: "get",
    url: `${domain}/api${url}`,
    params,
  }).then(function (response) {
    if (response.status === 200) {
      return response.data;
    } else if (response.status === 504) {
      return {};
    } else {
      return "error";
    }
  });
};

export { post, get };
