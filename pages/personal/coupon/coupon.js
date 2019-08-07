// pages/personal/coupon/coupon.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    tabList: [{
      index: 1,
      name: '未使用'
    }, {
      index: 2,
      name: '已使用'
    }, {
      index: 3,
      name: '已过期'
    }, {
      index: 4,
      name: '已赠送'
    }],
    rmbImage: '/resources/images/user/rmb.png',
    couponList: [],
    yhqztDesc: '未使用'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取vip信息
    var that = this;
    wx.getStorage({
      key: 'vipInfo',
      success: function (res) {
        that.setData({
          vipid: res.data.id
        });
        // 加载优惠券列表
        that.loadCoupon('1');
      },
    });
  },

  swichNav: function(e) {
    let currentTab = e.detail.currentTab;
    let yhqztDesc = '';
    switch (currentTab) {
      case 1: yhqztDesc = '未使用'; break;
      case 2: yhqztDesc = '已使用'; break;
      case 3: yhqztDesc = '已过期'; break;
      case 4: yhqztDesc = '已赠送'; break;
    }
    this.setData({
      yhqztDesc: yhqztDesc
    })
      
    this.loadCoupon(currentTab);
  },

  /**
   * 加载优惠券列表
   */
  loadCoupon: function (yhqzt) {
    let params = {
      url: app.globalData.serverUrl + 'getCoupons',
      body: {
        userid: this.data.vipid,
        yhqzt: yhqzt,
        yxqq: util.dateUtil.format(new Date(), 'Y-M-D H:F:S'),
        yxqz: util.dateUtil.format(new Date(), 'Y-M-D H:F:S')
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        console.log(data);
        that.setData({
          couponList: data
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