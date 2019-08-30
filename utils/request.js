/**
 * 处理请求
 * param:
 *    url:请求地址
 *    body: 请求参数
 *    method: 请求方法(GET, POST))
 *    responseType: 返回数据类型
 */
var doRequest=function(param, successFun, failFun) {
  wx.showLoading({
    title: '加载中',
  })
  if (!param.url) {
    console.error("请传入请求地址")
    return;
  }

  if (!param.body) {
    console.error("请传入请求参数")
    return;
  }

  wx.request({
    url: param.url,
    data: param.body,
    method: param.method ? param.method : 'GET',
    dataType: "json",
    success: function(res) {
      wx.hideLoading();
      if (!res.data) {
        wx.showToast({
          title: '请求错误',
          icon: 'none'
        })
      } else {
        if (res.data.code != '1') {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        } else {
          successFun(res.data.data);
        }
      }
    },
    fail(res) {
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        success:  function(res) {
          failFun(res);
        }
      })
    }
  })
}

module.exports = {
  doRequest: doRequest
}