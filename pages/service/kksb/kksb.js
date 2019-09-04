// pages/service/czmm/czmm.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '智能设备', //导航栏 中间的标题
      back: true
    },
    hideDeviceCommand: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadWeather();
    this.loadDevices();
  }, 

  /**
   * 加载天气信息
   */
  loadWeather: function() {
    let params = {
      url: app.globalData.serverUrl + 'getWeather',
      body: {
        orderid: '83'
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        console.log(data);
        if (data.code == '1') {
          that.setData({
            weather: data
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
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
  },

  /**
   * 加载智能设备信息
   */
  loadDevices: function() {
    let params = {
      url: app.globalData.serverUrl + 'getDevices',
      body: {
        orderid: '83'
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        console.log(data);
        that.setData({
          deviceList: data
        });
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
   * 显示设备指令窗口
   */
  showCommad: function(e) {
    let index = e.currentTarget.dataset.index;
    let commands = this.data.deviceList[index].commands;
    let selectDeviceId = this.data.deviceList[index].id;
    if (commands.length > 0) {
      this.setData({
        commands: commands,
        hideDeviceCommand: false,
        selectDeviceId: selectDeviceId
      })
    }
  },

  /**
   * 取消
   */
  cancelCommand: function() {
    this.setData({
      hideDeviceCommand: true
    })
  },

  /**
   * 下达指令
   */
  commad: function(e) {
    let index = e.currentTarget.dataset.index;
    let params = {
      url: app.globalData.serverUrl + 'commadDevice',
      body: {
        device_id: this.data.commands[index].deviceid,
        code: this.data.commands[index].command_code,
        type: this.data.commands[index].command_type,
        value: this.data.commands[index].command_type == 'Enum' ? this.data.commands[index].command_values : ''
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        if (data.success) {
          that.cancelCommand();
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none'
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