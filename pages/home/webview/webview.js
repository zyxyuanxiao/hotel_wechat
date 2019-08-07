// pages/home/webview/webview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("app.js ---onReady---");
    if (this.data.link) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      this.setData({
        link: options.link
      })
    }
  },

  onLaunch: function (options) {
    console.log("app.js ---onLaunch---" + JSON.stringify(options));
  },
  onShow: function () {
    console.log("app.js ---onShow---");
  },
  onHide: function () {
    console.log("app.js ---onHide---");
  },
  onReady: function() {
    console.log("app.js ---onReady---");
  }
})