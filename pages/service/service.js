// pages/service/service.js
const util = require('../../utils/util.js')
const request = require('../../utils/request.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderImg: '/resources/images/service/order.png',
    znkmImage: '/resources/images/service/click.png',
    mmkmImage: '/resources/images/service/password.png',
    rlkmImage: '/resources/images/service/rlsb.png',
    sfzkmImage: '/resources/images/service/sfz.png',
    drzList:[],
    rzzList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function (res) {
        if (res.data) {
          that.setData({
            userid: res.data.id
          })
          // 加载待入住订单
          that.loadOrderList('2');
          // 加载入驻中订单
          that.loadOrderList('3');
        } else {
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
        }
      },
    })
  },

  /**
   * 跳转到我的订单界面
   */
  navigateToOrder: function() {
    wx.switchTab({
      url: '/pages/order/order',
    })
  },

  /**
   * 跳转到房间搜索界面
   */
  navigateToSearch: function() {
    util.navigateTo('/pages/home/search/search', true);
  },

  /**
   * 跳转到办理入住界面
   */
  navigateToBlrz: function(e) {
    wx.navigateTo({
      url: '/pages/service/blrz/blrz?orderid=' + e.currentTarget.dataset.orderid,
    })
  },

  /**
   * 跳转到在住服务界面
   */
  navigateToZzfw: function(e) {
    wx.navigateTo({
      url: '/pages/service/zzfw/zzfw?orderid=' + e.currentTarget.dataset.orderid,
    })
  },

  /**
   * 加载订单列表
   */
  loadOrderList: function (ddzt) {
    let params = {
      url: app.globalData.serverUrl + 'getOrders',
      body: {
        ddzt: ddzt,
        xdrid: this.data.userid
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        console.log(data);
        if (ddzt == '2') {
          that.setData({
            drzList: data
          })
        } else if (ddzt == '3') {
          that.setData({
            rzzList: data
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