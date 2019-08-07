const request = require('request.js')
var app = getApp();

let payUtil = {
  /**
   * 调用登录接口获取code
   * successFun: 成功回调函数
   */
  getOpenid: function(successFun) {
    //调用登录接口
    wx.login({
      success: function (res) {
        let params = {
          url: app.globalData.serverUrl + 'wxLogin',
          body: {
            js_code: res.code
          }
        }
        let that = this;
        request.doRequest(
          params,
          function (data) {
            wx.setStorageSync('openId', data.openid); //存在小程序缓存中
            successFun();
          },
          function (data) {
            wx.showToast({
              title: '请求错误',
              icon: 'none'
            })
          }
        )
      }
    })
  },

  /**
   * 获取签名
   */
  getSign: function (data) {
    let params = {
      url: app.globalData.serverUrl + 'getSign',
      body: data.data
    }
    let that = this;
    request.doRequest(
      params,
      function (resData) {
        wx.requestPayment({
          'timeStamp': resData.timeStamp + '',
          'nonceStr': resData.nonceStr,
          'package': resData.package,
          'signType': resData.signType,
          'paySign': resData.paySign,
          'success': function (res) { 
            // 支付成功回调
            data.successFun(resData.wechatpayid);
          },
          'fail': function (res) {
            // 支付成功回调
            data.failFun(resData.wechatpayid);
           },
          'complete': function (res) { }
        }) 

      },
      function (data) {
        wx.showToast({
          title: '请求错误',
          icon: 'none'
        })
      }
    )
  },

  /**
   * 支付
   * params: 
   *  total_fee: 总金额
   *  paytype: 交易类型
   *  desc: 交易描述
   *  vipid: 交易用户
   */
  pay: function(params) {
    var that = this;
    wx.getStorage({
      key: 'openId',
      success: function(res) {
        params.data['openid'] = res.data;
        that.getSign(params);
      },
      fail: function(res) {
        that.getOpenid(function() {
          that.pay(params);
        })
      }
    })
  }
}

module.exports = {
  payUtil: payUtil
}