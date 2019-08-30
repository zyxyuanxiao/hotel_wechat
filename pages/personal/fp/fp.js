// pages/personal/fp/fp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
      index: 1,
      name: '可开发票'
    }, {
      index: 2,
      name: '已开发票'
    }],
    currentTab: 1,
    circleImage: '/resources/images/circle.png',
    selectedImage: '/resources/images/success-filling.png',
    isSelectedAll: false,   //是否全选
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '发票', //导航栏 中间的标题
      back: true
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 切换tab页
   */
  swichNav: function(e) {
    this.setData({
      currentTab: e.detail.currentTab
    });
  },

  /**
   * 全选
   */
  selectAll: function() {
    this.setData({
      isSelectedAll: !this.data.isSelectedAll
    });
  }
})