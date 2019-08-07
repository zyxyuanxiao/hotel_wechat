// pages/personal/cyrzr/tjrzr/tjrzr.js
const util = require('../../../../utils/util.js')
const request = require('../../../../utils/request.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
          vipid: res.data.id
        });
      },
    });
  },

  /**
   * 输入入住人姓名
   */
  inputCyrzrxm: function(e) {
    this.setData({
      rzrxm: e.detail.value
    })
  },

  /**
   * 输入入住人手机号码
   */
  inputCyrzrSjhm: function(e) {
    this.setData({
      sjhm: e.detail.value
    })
  },

  /**
   * 添加常用入住人
   */
  addCyrzr: function () {
    let str = /^1\d{10}$/
    if (!str.test(this.data.sjhm)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
      return;
    }

    let params = {
      url: app.globalData.serverUrl + 'addCyrzr',
      body: {
        vipid: this.data.vipid,
        yx: '1',
        rzrxm: this.data.rzrxm,
        sjhm: this.data.sjhm,
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        wx.showToast({
          title: data,
          icon: 'none',
          success: function() {
            wx.navigateBack({
              url: '/pages/personal/cyrzr/cyrzr'
            })
          }
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