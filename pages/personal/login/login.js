// pages/personal/login/login.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPhoneLogin: false,
    code_btn: '获取验证码',
    code_btn_disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res);
        that.setData({
          userInfo: res.data
        });
      },
    })
  },

  /**
   * 显示手机登录
   */
  showPhoneLogin: function() {
    this.setData({
      isPhoneLogin: true
    })
  },

  /**
   * 隐藏手机登录
   */
  hidePhoneLogin: function() {
    this.setData({
      isPhoneLogin: false
    })
  },

  /**
   * 获取手机号码
   */
  getPhoneNumber: function(e) {
    console.log(e);
  },

  /**
   * 手机号码输入
   */
  inputPhoneNum: function(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },

  /**
   * 检查手机号码格式是否正确
   */
  checkPhoneNum: function(phoneNum) {
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
      return false
    }
  },

  /**
   * 获取验证码
   */
  getCode: function() {
    var that = this;
    var cnt = 60;
    if (this.checkPhoneNum(this.data.phoneNum)) {
      setInterval(function() {
        that.setData({
          code_btn: cnt + 's',
          code_btn_disabled: true
        });
        cnt--;
      }, 1000, cnt)
    }
  },

  /**
   * 登录
   */
  login: function() {
    var that = this;
    let params = {
      url: app.globalData.serverUrl + 'login',
      body: {
        sjhm: this.data.phoneNum,
        xm: this.data.userInfo.nickName,
        tx: this.data.userInfo.avatarUrl
      }
    }

    request.doRequest(
      params,
      function (data) {
        wx.setStorage({
          key: 'isLogin',
          data: true,
        })
        wx.setStorage({
          key: 'vipInfo',
          data: data,
        })
        wx.navigateBack({})
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