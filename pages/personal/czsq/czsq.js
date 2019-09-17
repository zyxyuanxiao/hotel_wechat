// pages/personal/czsq/czsq.js
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
      title: '长租申请', //导航栏 中间的标题
      back: true
    },
    kfdh: app.globalData.servicePhone
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
})