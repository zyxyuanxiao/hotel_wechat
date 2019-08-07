// pages/personal/money/money.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentJe: 0,
    circleImage: '/resources/images/circle.png',
    successImage: '/resources/images/success.png',
    czImage: '/resources/images/user/cz.png'
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
    let params = {
      url: app.globalData.serverUrl + 'addConsume',
      body: {
        vipid: this.data.vipInfo.id,
        xfje: this.data.currentJe,
        xflx: '2',
        xfqye: this.data.xfqye
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        wx.showToast({
          title: '充值成功',
          icon: 'none'
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