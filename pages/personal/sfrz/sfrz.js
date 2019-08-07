// pages/personal/sfrz/sfrz.js
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraImage: '/resources/images/user/camera.png',
    hiddenGrxx: true
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
        // 加载实名认证信息
        that.loadSmrzxx();
      },
    });
  },

  /**
   * 选择图片
   */
  selectImage: function(e) {
    if (this.data.rzjg == '2') {
      return;
    }
    let imageType = e.currentTarget.dataset.type;
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // 上传图片
        that.uploadImage(imageType, res.tempFilePaths[0]);
      }
    })
  },

  /**
   * 上传图片
   */
  uploadImage: function(type, imagePath) {
    var that = this;
    wx.uploadFile({
      url: app.globalData.uploadUrl,
      filePath: imagePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success(res) {
        var response = JSON.parse(res.data);
        if (response.code == '0') {
          if (type == '1') {
            that.setData({
              sfzzmImage: response.data[0]
            })
          } else if (type == '2') {
            that.setData({
              sfzfmImage: response.data.data[0]
            })
          } else if (type == '3') {
            that.setData({
              zpzImage: response.data.data[0]
            })
          }
        } else {
          wx.showToast({
            title: response.msg,
            icon: 'icon'
          })
        }
      }
    })
  },

  /**
   * 保存身份认证信息
   */
  saveSfrzxx: function() {
    if (this.data.xm == undefined) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return;
    }
    if (this.data.sfzhm == undefined) {
      wx.showToast({
        title: '请输入证件号码',
        icon: 'none'
      })
      return;
    } else {
      let flag = util.cardIDUtil.verification(this.data.sfzhm);
      if (flag != true) {
        wx.showToast({
          title: flag,
          icon: 'none'
        })
        return;
      }
    }

    let params = {
      url: app.globalData.serverUrl + 'saveSfrz',
      body: {
        sfz_1: this.data.sfzzmImage,
        sfz_2: this.data.sfzfmImage,
        zpz: this.data.zpzImage,
        rzjg: '1',
        rzrid: this.data.vipid,
        rzrlx: '1',
        xm: this.data.xm,
        sfzhm: this.data.sfzhm
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        wx.showModal({
          title: '温馨提示',
          content: '已提交认证，请等待认证结果',
          confirmText: "确定", //默认是“确定”
          showCancel: false,//是否显示取消按钮
          confirmColor: 'skyblue',//确定文字的颜色
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                url: '/pages/personal/personal'
              })
            }
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

  // 加载实名认证信息
  loadSmrzxx: function() {
    let params = {
      url: app.globalData.serverUrl + 'selectSmrz',
      body: {
        sfyx: '1',
        rzrid: this.data.vipid,
        rzrlx: '1'
      }
    }
    let that = this;
    request.doRequest(
      params,
      function (data) {
        if (data == '不存在实名认证信息') {
          return;
        }
        that.setData({
          xm: data.xm,
          sfzhm: data.sfzhm,
          sfzzmImage: data.sfz_1,
          sfzfmImage: data.sfz_2,
          zpzImage: data.zpz,
          id: data.id,
          rzjg: data.rzjg
        });
        if (data.rzjg == '1') {
          wx.showModal({
            title: '温馨提示',
            content: '实名认证审核中，请耐心等待',
            confirmText: "确定", //默认是“确定”
            showCancel: false,//是否显示取消按钮
            confirmColor: 'skyblue',//确定文字的颜色
          })
        } else if (data.rzjg == '2') {
          wx.showModal({
            title: '温馨提示',
            content: '实名认证已通过',
            confirmText: "确定", //默认是“确定”
            showCancel: false,//是否显示取消按钮
            confirmColor: 'skyblue',//确定文字的颜色
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '实名认证审核不通过，请重新认证',
            confirmText: "确定", //默认是“确定”
            showCancel: false,//是否显示取消按钮
            confirmColor: 'skyblue',//确定文字的颜色
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
   * 展示个人信息
   */
  showGrxx: function() {
    if (this.data.sfzfmImage == undefined || this.data.sfzfmImage == undefined 
      || this.data.zpzImage == undefined) {
      wx.showToast({
        title: '请选择照片',
        icon: 'none'
      })
      return;
    }
    this.setData({
      hiddenGrxx: false
    })
  },

  /**
   * 取消
   */
  cancel: function() {
    this.setData({
      hiddenGrxx: true
    })
  },

  /**
   * 输入姓名
   */
  inputXm: function(e) {
    this.setData({
      xm: e.detail.value
    })
  },

  /**
   * 输入身份证号码
   */
  inputZjhm: function (e) {
    this.setData({
      sfzhm: e.detail.value
    })
  },
})