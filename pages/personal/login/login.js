// pages/personal/login/login.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
const payUtil = require('../../../utils/wxpay.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPhoneLogin: false,
    code_btn: '获取验证码',
    code_btn_disabled: false,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '登录', //导航栏 中间的标题
      back: true,
      sjhly: 'input'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data
        });
      },
    })

    // 获取sessionKey
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        wx.getStorage({
          key: 'sessionKey',
          success: function (res) {
            that.setData({
              sessionKey: res.data
            })
          }
        })
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        payUtil.payUtil.getOpenid(function() {
          wx.getStorage({
            key: 'sessionKey',
            success: function (res) {
              that.setData({
                sessionKey: res.data
              })
            }
          })
        })
      }
    })
    
  },

  /**
   * 显示手机登录
   */
  showPhoneLogin: function() {
    this.setData({
      isPhoneLogin: true,
      sjhly: 'input'
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
    this.setData({
      sjhly: 'wechat',
    })
    console.log(this.data.sessionKey);
    // 解密
    let params = {
      url: app.globalData.serverUrl + 'decodeWxAppPhone',
      body: {
        encrypted: e.detail.encryptedData,
        iv: e.detail.iv,
        session_key: this.data.sessionKey
      }
    }
    var that = this;
    request.doRequest(
      params,
      function (data) {
        that.setData({
          phoneNum: data
        })
        that.login();
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
   * 手机号码输入
   */
  inputPhoneNum: function(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },

  /**
   * 输入验证码
   */
  inputCode: function(e) {
    this.setData({
      code: e.detail.value
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
    // 校验手机号码是否合法
    if (!this.checkPhoneNum(this.data.phoneNum)) {
      return;
    }
    let params = {
      url: app.globalData.serverUrl + 'getCode',
      body: {
        phone: this.data.phoneNum
      }
    }
    var that = this;
    request.doRequest(
      params,
      function (data) {
        that.setData({
          codeid: data
        });
        wx.showModal({
          title: '温馨提示',
          content: '验证码已发送成功',
          cancel: false,
          success: function(res) {
            var cnt = 60;
            setInterval(function () {
              that.setData({
                code_btn: cnt + 's',
                code_btn_disabled: true
              });
              cnt--;
            }, 1000, cnt)
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
  },

  /**
   * 登录
   */
  login: function() {
    // 如果是输入手机号，则必须校验验证码，否则不用校验验证码
    if (this.data.sjhly == 'input' && (this.data.code == undefined || this.data.code == '')) {
      wx.showToast({
        title: '请输入验证码',
      })
      return;
    }
    // 校验手机号码是否合法
    if (!this.checkPhoneNum(this.data.phoneNum)) {
      return;
    }

    var that = this;
    let params = {
      url: app.globalData.serverUrl + 'login',
      body: {
        sjhm: this.data.phoneNum,
        xm: this.data.userInfo.nickName,
        tx: this.data.userInfo.avatarUrl,
        sjhly: this.data.sjhly,
        codeId: this.data.sjhly == 'input' ? this.data.codeid : '',
        code: this.data.sjhly == 'input' ? this.data.code : ''
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