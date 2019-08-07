// pages/order/orderinfo/orderinfo.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendarImage: '/resources/images/home/calendar.png',
    ddzt: ['待支付', '待入住', '入住中', '待评价', '已完成', '已取消']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid
    })
    this.loadOrderInfo();
    this.loadOrderRoomList();
  },

  /**
   * 拨打客服电话
   */
  makePhoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: '0719-8885855',
    })
  },

  /**
   * 加载订单信息
   */
  loadOrderInfo: function () {
    let params = {
      url: app.globalData.serverUrl + 'getOrder',
      body: {
        orderid: this.data.orderid
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        console.log(data);
        that.setData({
          hotel: data.hotel,
          orderInfo: data.orderInfo,
          rzts: util.dateUtil.convertToChinaNum(data.orderInfo.rzts) + '天',
          sfje: util.parseDouble(data.orderInfo.sfje),
          rzrq: util.dateUtil.formatTime(data.orderInfo.rzsj, 'M月D日'),
          rzsj: util.dateUtil.formatTime(data.orderInfo.rzsj, 'H:F'),
          rzrqWeek: util.dateUtil.getDetail(new Date(data.orderInfo.rzsj)).weekday,
          ldrq: util.dateUtil.formatTime(data.orderInfo.ldsj, 'M月D日'),
          ldsj: util.dateUtil.formatTime(data.orderInfo.ldsj, 'H:F'),
          ldrqWeek: util.dateUtil.getDetail(new Date(data.orderInfo.ldsj)).weekday,
          ddztName: that.data.ddzt[data.orderInfo.ddzt - 1]
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
   * 加载订单房间列表
   */
  loadOrderRoomList: function() {
    let params = {
      url: app.globalData.serverUrl + 'getOrderRooms',
      body: {
        orderid: this.data.orderid
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        console.log(data);
        that.setData({
          roomList: data
        })
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