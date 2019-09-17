// pages/personal/yj/yj.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
const payUtil = require('../../../utils/wxpay.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    yjje: 0,
    yjImage: '/resources/images/user/yj_w.png',
    helpImage: '/resources/images/help.png',
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '押金', //导航栏 中间的标题
      back: true
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function (res) {
        if (res.data) {
          that.setData({
            vipid: res.data.id,
          })
          that.loadDeposit();
        } else {
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
        }
      },
    });
  },


  /**
   * 提交押金
   */
  payYj: function () {
    var that = this;
    // 发起微信支付
    var params = {};
    params['data'] = {
      total_fee: 300 * 100,
      paytype: '1',
      desc: '锦恒科技-押金',
      vipid: this.data.vipid
    }
    // 支付成功后保存账项信息
    let requestParam = {
      url: app.globalData.serverUrl + 'addDeposit',
      body: {
        vipid: this.data.vipid,
        yjje: 300,
        yjzt: 0
      }
    }
    // 支付成功回调函数
    params['successFun'] = function (wechatpayid) {
      requestParam.body['wxpayid'] = wechatpayid;
      request.doRequest(
        requestParam,
        function (data) {
          wx.showToast({
            title: '缴纳成功',
            icon: 'none'
          })
        },
        function (data) {
          wx.showToast({
            title: '服务器异常',
            icon: 'none'
          })
        }
      )
    }
    // 支付失败回调函数
    params['failFun'] = function () {
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
    }
    payUtil.payUtil.pay(params);
  },

  /**
   * 加载是否存在押金
   */
  /**
   * 加载押金信息
   */
  loadDeposit: function () {
    var that = this;
    // 更新订单状态
    var params = {
      url: app.globalData.serverUrl + 'getDeposit',
      body: {
        vipid: this.data.vipid,
        yjzt: 0
      }
    }
    request.doRequest(
      params,
      function (data) {
        if (data.length > 0) {
          that.setData({
            yjje: data[0].yjje
          })
        }
      },
      function (data) {
        wx.showToast({
          title: '服务器异常',
          icon: 'none'
        })
      }
    )
  },
})