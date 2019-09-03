// pages/personal/sfrz/camera/camera.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '拍照', //导航栏 中间的标题
      back: true
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imageType: options.imageType,
      cameraClass: options.imageType == '3' ? 'camera-box-zpz' : 'camera-box-sfz',
      cameraHeight: options.imageType == '3' ? 350 : 180,
      device_position: options.imageType == '3' ? 'front' : 'back',
    })
  },

  /**
   * 拍照
   */
  takePhoto: function() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.uploadImage(res.tempImagePath);
        wx.navigateBack({
          url: '/pages/personal/sfrz/sfrz'
        });
      }
    })
  }
})