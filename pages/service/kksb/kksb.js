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
    currentTab: 1,
    tabList: [
      {
        index: 1,
        name: '开关'
      }, {
        index: 2,
        name: '电视'
      }, {
        index: 3,
        name: '空调'
      }, {
        index: 4,
        name: '窗帘'
      }, {
        index: 5,
        name: '情景模式'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  swichNav: function (e) {
    let index = e.detail.currentTab;
    this.setData({
      currentTab: index
    });
  },
})