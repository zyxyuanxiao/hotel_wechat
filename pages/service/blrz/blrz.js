// pages/service/blrz/blrz.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
const payUtil = require('../../../utils/wxpay.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '入住', //导航栏 中间的标题
      back: true
    },
    smrzClass: 'rzts-btn-wb',
    tjyjClass: 'rzts-btn-wb',
    sftjyj: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid
    })
    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function (res) {
        if (res.data) {
          that.setData({
            userid: res.data.id,
            smrz: res.data.sfrz,
            smrzClass: res.data.sfrz == '0' ? 'rzts-btn-wb' : 'rzts-btn-yb'
          })
        } else {
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
        }
      },
    });
    this.loadDeposit();
  },

  /**
   * 提交押金
   */
  payYj: function() {
    if (this.data.sftjyj == '1') {
      wx.showModal({
        title: '温馨提示',
        content: '您已提交押金' + this.data.yjxx.yjje + '原',
        confirmText: "确定", //默认是“确定”
        showCancel: false,//是否显示取消按钮
        confirmColor: 'skyblue',//确定文字的颜色
      })
      return;
    }
    var that = this;
    // 发起微信支付
    var params = {};
    params['data'] = {
      total_fee: 0.01 * 100,
      paytype: '1',
      desc: '锦恒科技-押金',
      vipid: this.data.userid
    }
    // 支付成功后保存账项信息
    let requestParam = {
      url: app.globalData.serverUrl + 'saveAccount',
      body: {
        ddid: this.data.orderid,
        je: 0.01
      }
    }
    // 支付成功回调函数
    params['successFun'] = function (wechatpayid) {
      request.doRequest(
        requestParam,
        function (data) {
          // 添加押金缴纳记录
          that.addDeposit(wechatpayid);
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
   * 提交实名认证
   */
  tjsmrz: function() {
    // 未进行实名认证，则先进行实名认证
    if (this.data.smrz == '0') {
      util.navigateTo('/pages/personal/sfrz/sfrz', true);
    }
  },

  /**
   * 办理入住
   */
  blrz: function() {
    if (this.data.smrz != '2') {
      wx.showToast({
        title: '请先进行实名认证',
        icon: 'none'
      })
      return;
    }
    if (this.data.sftjyj != 1) {
      wx.showToast({
        title: '请提交押金',
        icon: 'none'
      })
      return;
    }
    var that = this;
    // 更新订单状态
    var params = {
      url: app.globalData.serverUrl + 'checkIn',
      body: {
        id: this.data.orderid
      }
    }
    request.doRequest(
      params,
      function (data) {
        wx.showToast({
          title: '入住成功',
          icon: 'none',
          success: function() {
            util.navigateTo('/pages/service/service', true);
          }
        })
      },
      function (data) {
        wx.showToast({
          title: '服务器异常',
          icon: 'none'
        })
      }
    )
  },

  /**
   * 加载押金信息
   */
  loadDeposit: function() {
    var that = this;
    // 更新订单状态
    var params = {
      url: app.globalData.serverUrl + 'getDeposit',
      body: {
        orderid: this.data.orderid,
        yjzt: '1'
      }
    }
    request.doRequest(
      params,
      function (data) {
        if (data.length > 0) {
          that.setData({
            sftjyj: '1',
            tjyjClass: 'rzts-btn-yb',
            yjxx: data[0]
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

  /**
   * 保存押金支付记录
   */
  addDeposit: function (wechatpayid) {
    var that = this;
    // 更新订单状态
    var params = {
      url: app.globalData.serverUrl + 'addDeposit',
      body: {
        orderid: this.data.orderid,
        vipid: this.data.vipid,
        yjje: 0.01,
        yjzt: 1,
        wxpayid: wechatpayid
      }
    }
    request.doRequest(
      params,
      function (data) {
        that.setData({
          sftjyj: '1',
          tjyjClass: 'rzts-btn-yb'
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
})