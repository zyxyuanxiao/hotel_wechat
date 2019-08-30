// pages/personal/money/money.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
const payUtil = require('../../../utils/wxpay.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentJe: 0,
    circleImage: '/resources/images/circle.png',
    successImage: '/resources/images/success.png',
    czImage: '/resources/images/user/cz.png',
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '钱包', //导航栏 中间的标题
      back: true
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取vip信息
    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function (res) {
        that.setData({
          vipInfo: res.data
        });
        // 加载钱包消费记录
        that.loadQbxfjl();
      },
    });
  },

  /**
   * 选择充值金额
   */
  selectJe: function(e) {
    let czje = e.currentTarget.dataset.number;
    if (czje == this.data.currentJe) {
      czje = 0;
    }
    this.setData({
      currentJe: czje
    });
  },

  /**
   * 钱包充值
   */
  qbcz: function() {
    var that = this;
    // 发起微信支付
    var params = {};
    params['data'] = {
      total_fee: this.data.currentJe * 100,
      paytype: '1',
      desc: '锦恒科技-钱包充值',
      vipid: this.data.vipInfo.id
    }

    let requestParam = {
      url: app.globalData.serverUrl + 'addConsume',
      body: {
        vipid: this.data.vipInfo.id,
        xfje: this.data.currentJe,
        xflx: '2',
        xfqye: this.data.xfqye
      }
    }
    // 支付成功回调函数
    params['successFun'] = function (wechatpayid) {
      requestParam.body['wechatpayid'] = wechatpayid;
      request.doRequest(
        requestParam,
        function (data) {
          wx.showToast({
            title: '充值成功',
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
    params['failFun'] = function () {}
    payUtil.payUtil.pay(params);
  },

  /**
   * 加载最新一条钱包消费记录
   */
  loadQbxfjl: function() {
    let params = {
      url: app.globalData.serverUrl + 'selectLatestConsume',
      body: {
        vipid: this.data.vipInfo.id
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        if (data == undefined || data.id == undefined) {
          that.setData({
            xfqye: 0
          })
        } else {
          that.setData({
            xfqye: data.xfqye
          })
        }
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